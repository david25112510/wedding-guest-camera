import { env } from "cloudflare:workers";
import { getAdminUser } from "../../../../../lib/admin-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminUser())) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;
  const photo = await env.DB.prepare(
    "SELECT object_key, thumbnail_object_key, content_type FROM photos WHERE id = ? LIMIT 1",
  )
    .bind(id)
    .first<{ object_key: string; thumbnail_object_key: string | null; content_type: string }>();

  if (!photo) return new Response("Not found", { status: 404 });

  const variant = new URL(request.url).searchParams.get("variant");
  const objectKey = variant === "thumbnail" && photo.thumbnail_object_key
    ? photo.thumbnail_object_key
    : photo.object_key;
  const object = await env.BUCKET.get(objectKey);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": photo.content_type,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
      "content-disposition": "inline",
    },
  });
}
