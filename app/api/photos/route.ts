import { env } from "cloudflare:workers";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "../../../db";
import { guests, photos } from "../../../db/schema";
import { eventConfig } from "../../../lib/event-config";

const LIMIT = eventConfig.maximumPhotosPerGuest;
const MAX_FILE_SIZE = 12 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;
const MAX_GALLERY_PHOTOS = 1200;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function guestId() {
  const jar = await cookies();
  let id = jar.get("momentos_guest")?.value;
  if (!id) {
    id = crypto.randomUUID();
    jar.set("momentos_guest", id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 2592000,
    });
  }
  return id;
}

function extensionFor(contentType: string) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  return "webp";
}

function matchesSignature(bytes: Uint8Array, contentType: string) {
  if (contentType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (contentType === "image/png") {
    return bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  }
  if (contentType === "image/webp") {
    return bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

export async function GET() {
  const db = getDb();
  const id = await guestId();
  const [guest] = await db.select().from(guests).where(eq(guests.id, id)).limit(1);
  const rows = await db.select().from(photos).where(eq(photos.hidden, 0)).orderBy(desc(photos.createdAt)).limit(MAX_GALLERY_PHOTOS);

  return Response.json(
    {
      remaining: Math.max(0, LIMIT - (guest?.photoCount ?? 0)),
      total: rows.length,
      photos: rows.map((photo) => ({
        id: photo.id,
        guestName: photo.guestName,
        createdAt: photo.createdAt,
        url: `/api/photos/${photo.id}`,
        thumbnailUrl: photo.thumbnailObjectKey
          ? `/api/photos/${photo.id}?variant=thumbnail`
          : `/api/photos/${photo.id}`,
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("photo");
  const thumbnail = form.get("thumbnail");
  const name = String(form.get("guestName") ?? "Convidado").trim().slice(0, 40) || "Convidado";

  if (!(file instanceof File) || !ALLOWED_TYPES.has(file.type)) {
    return Response.json(
      { error: "Envie uma foto em JPEG, PNG ou WebP." },
      { status: 400 },
    );
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    return Response.json(
      { error: "A foto deve ter no máximo 12 MB." },
      { status: 400 },
    );
  }

  if (
    !(thumbnail instanceof File) ||
    !ALLOWED_TYPES.has(thumbnail.type) ||
    thumbnail.type !== file.type
  ) {
    return Response.json(
      { error: "Não foi possível preparar a miniatura da foto." },
      { status: 400 },
    );
  }

  if (thumbnail.size <= 0 || thumbnail.size > MAX_THUMBNAIL_SIZE) {
    return Response.json(
      { error: "A miniatura da foto ficou maior que o permitido." },
      { status: 400 },
    );
  }

  const [buffer, thumbnailBuffer] = await Promise.all([
    file.arrayBuffer(),
    thumbnail.arrayBuffer(),
  ]);
  const bytes = new Uint8Array(buffer.slice(0, 16));
  const thumbnailBytes = new Uint8Array(thumbnailBuffer.slice(0, 16));
  if (!matchesSignature(bytes, file.type) || !matchesSignature(thumbnailBytes, thumbnail.type)) {
    return Response.json(
      { error: "O arquivo não corresponde a uma imagem válida." },
      { status: 400 },
    );
  }

  const id = await guestId();

  await env.DB.prepare(
    "INSERT OR IGNORE INTO guests (id, name, photo_count, created_at) VALUES (?, ?, 0, CURRENT_TIMESTAMP)",
  )
    .bind(id, name)
    .run();

  const reservation = await env.DB.prepare(
    "UPDATE guests SET name = ?, photo_count = photo_count + 1 WHERE id = ? AND photo_count < ?",
  )
    .bind(name, id, LIMIT)
    .run();

  if ((reservation.meta.changes ?? 0) !== 1) {
    return Response.json(
      { error: `Você já utilizou suas ${LIMIT} fotos.`, remaining: 0 },
      { status: 403 },
    );
  }

  const photoId = crypto.randomUUID();
  const objectKey = `event/photos/${photoId}.${extensionFor(file.type)}`;
  const thumbnailObjectKey = `event/thumbnails/${photoId}.${extensionFor(thumbnail.type)}`;

  try {
    await Promise.all([
      env.BUCKET.put(objectKey, buffer, {
        httpMetadata: { contentType: file.type },
        customMetadata: { guestId: id, variant: "full" },
      }),
      env.BUCKET.put(thumbnailObjectKey, thumbnailBuffer, {
        httpMetadata: { contentType: thumbnail.type },
        customMetadata: { guestId: id, variant: "thumbnail" },
      }),
    ]);

    await env.DB.prepare(
      "INSERT INTO photos (id, guest_id, guest_name, object_key, thumbnail_object_key, content_type, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
    )
      .bind(photoId, id, name, objectKey, thumbnailObjectKey, file.type)
      .run();
  } catch (error) {
    await Promise.allSettled([
      env.BUCKET.delete(objectKey),
      env.BUCKET.delete(thumbnailObjectKey),
      env.DB.prepare(
        "UPDATE guests SET photo_count = CASE WHEN photo_count > 0 THEN photo_count - 1 ELSE 0 END WHERE id = ?",
      )
        .bind(id)
        .run(),
    ]);
    console.error("Photo upload failed", error);
    return Response.json(
      { error: "Não foi possível guardar a foto. Tente novamente." },
      { status: 500 },
    );
  }

  const [updatedGuest] = await getDb().select().from(guests).where(eq(guests.id, id)).limit(1);
  return Response.json(
    { remaining: Math.max(0, LIMIT - (updatedGuest?.photoCount ?? LIMIT)) },
    { status: 201 },
  );
}
