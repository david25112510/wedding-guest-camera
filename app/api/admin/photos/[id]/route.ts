import { env } from "cloudflare:workers";
import { getAdminUser } from "../../../../../lib/admin-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminUser())) {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;
  const photo = await env.DB.prepare(
    "SELECT object_key, content_type FROM photos WHERE id = ? LIMIT 1",
  )
    .bind(id)
    .first<{ object_key: string; content_type: string }>();

  if (!photo) return new Response("Not found", { status: 404 });

  const object = await env.BUCKET.get(photo.object_key);
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
