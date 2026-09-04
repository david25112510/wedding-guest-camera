import { env } from "cloudflare:workers";
import { getAdminUser } from "../../../../lib/admin-auth";

type AdminPhotoRow = {
  id: string;
  guest_id: string;
  guest_name: string;
  object_key: string;
  content_type: string;
  hidden: number;
  hidden_at: string | null;
  created_at: string;
};

function unauthorized() {
  return Response.json({ error: "Acesso administrativo não autorizado." }, { status: 403 });
}

export async function GET() {
  if (!(await getAdminUser())) return unauthorized();

  const [photosResult, guestsResult] = await env.DB.batch([
    env.DB.prepare(
      "SELECT id, guest_id, guest_name, object_key, content_type, hidden, hidden_at, created_at FROM photos ORDER BY created_at DESC LIMIT 1200",
    ),
    env.DB.prepare(
      "SELECT COUNT(*) AS total_guests FROM guests",
    ),
  ]);

  const rows = (photosResult.results ?? []) as unknown as AdminPhotoRow[];
  const guestCount = Number((guestsResult.results?.[0] as { total_guests?: number } | undefined)?.total_guests ?? 0);
  const hiddenCount = rows.filter((photo) => photo.hidden === 1).length;

  return Response.json(
    {
      stats: {
        total: rows.length,
        visible: rows.length - hiddenCount,
        hidden: hiddenCount,
        guests: guestCount,
      },
      photos: rows.map((photo) => ({
        id: photo.id,
        guestId: photo.guest_id,
        guestName: photo.guest_name,
        contentType: photo.content_type,
        hidden: photo.hidden === 1,
        hiddenAt: photo.hidden_at,
        createdAt: photo.created_at,
        url: `/api/admin/photos/${photo.id}`,
      })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function PATCH(request: Request) {
  if (!(await getAdminUser())) return unauthorized();

  const body = (await request.json().catch(() => null)) as { id?: unknown; hidden?: unknown } | null;
  if (!body || typeof body.id !== "string" || typeof body.hidden !== "boolean") {
    return Response.json({ error: "Ação inválida." }, { status: 400 });
  }

  const result = await env.DB.prepare(
    "UPDATE photos SET hidden = ?, hidden_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id = ?",
  )
    .bind(body.hidden ? 1 : 0, body.hidden ? 1 : 0, body.id)
    .run();

  if ((result.meta.changes ?? 0) !== 1) {
    return Response.json({ error: "Foto não encontrada." }, { status: 404 });
  }

  return Response.json({ success: true, hidden: body.hidden });
}

export async function DELETE(request: Request) {
  if (!(await getAdminUser())) return unauthorized();

  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  if (!body || typeof body.id !== "string") {
    return Response.json({ error: "Foto inválida." }, { status: 400 });
  }

  const photo = await env.DB.prepare(
    "SELECT guest_id, object_key FROM photos WHERE id = ? LIMIT 1",
  )
    .bind(body.id)
    .first<{ guest_id: string; object_key: string }>();

  if (!photo) return Response.json({ error: "Foto não encontrada." }, { status: 404 });

  await env.DB.batch([
    env.DB.prepare("DELETE FROM photos WHERE id = ?").bind(body.id),
    env.DB.prepare(
      "UPDATE guests SET photo_count = CASE WHEN photo_count > 0 THEN photo_count - 1 ELSE 0 END WHERE id = ?",
    ).bind(photo.guest_id),
  ]);

  try {
    await env.BUCKET.delete(photo.object_key);
  } catch (error) {
    console.error("R2 cleanup failed after administrative deletion", error);
  }

  return Response.json({ success: true });
}
