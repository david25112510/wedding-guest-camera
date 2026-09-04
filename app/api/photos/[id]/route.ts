import { env } from "cloudflare:workers";
import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { photos } from "../../../../db/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [photo] = await getDb().select().from(photos).where(and(eq(photos.id, id), eq(photos.hidden, 0))).limit(1);

  if (!photo) return new Response("Not found", { status: 404 });

  const variant = new URL(request.url).searchParams.get("variant");
  const objectKey = variant === "thumbnail" && photo.thumbnailObjectKey
    ? photo.thumbnailObjectKey
    : photo.objectKey;
  const object = await env.BUCKET.get(objectKey);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": photo.contentType,
      "cache-control": "private, max-age=3600",
      "x-content-type-options": "nosniff",
      "content-disposition": "inline",
    },
  });
}
