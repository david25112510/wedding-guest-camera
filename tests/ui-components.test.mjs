import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("optimizes a full photo and an independent thumbnail", async () => {
  const optimizer = await source("lib/image-optimization.ts");

  assert.match(optimizer, /FULL_MAX_EDGE = 2048/);
  assert.match(optimizer, /THUMBNAIL_MAX_EDGE = 720/);
  assert.match(optimizer, /imageOrientation: "from-image"/);
  assert.match(optimizer, /"image\/jpeg"/);
  assert.match(optimizer, /FULL_MAX_EDGE, 0\.82/);
  assert.match(optimizer, /THUMBNAIL_MAX_EDGE, 0\.72/);
});

test("sends both image variants and keeps the full photo for the lightbox", async () => {
  const page = await source("app/page.tsx");

  assert.match(page, /form\.append\("photo", optimized\.photo\)/);
  assert.match(page, /form\.append\("thumbnail", optimized\.thumbnail\)/);
  assert.match(page, /src=\{photo\.thumbnailUrl\}/);
  assert.match(page, /src=\{selectedPhoto\.url\}/);
});

test("keeps consent visible beside the camera action", async () => {
  const [page, styles] = await Promise.all([
    source("app/page.tsx"),
    source("app/interaction-fixes.css"),
  ]);

  assert.match(page, /Autorize a exibição das suas fotos/);
  assert.match(page, /Concordo e continuar/);
  assert.match(page, /role="group" aria-labelledby="consent-title"/);
  assert.match(styles, /\.capture__controls \.consent-card/);
  assert.match(styles, /pointer-events: none/);
});

test("keeps camera controls clickable and limits gallery rendering", async () => {
  const page = await source("app/page.tsx");

  assert.match(page, /disabled=\{uploading \|\| remaining <= 0\} aria-label=\{remaining > 0 \? "Abrir câmera"/);
  assert.match(page, /className="camera-action__gallery"[\s\S]*disabled=\{uploading \|\| remaining <= 0\}/);
  assert.match(page, /<button onClick=\{openCamera\}>Registrar agora<\/button>/);
  assert.match(page, /setConsented\(true\)[\s\S]*localStorage\.setItem\("24momentos_privacy_consent"/);
  assert.match(page, /setInterval\(refreshWhenVisible, 20000\)/);
  assert.match(page, /photos\.slice\(0, visiblePhotoCount\)/);
  assert.match(page, /loading="lazy" decoding="async"/);
});

test("stores, serves, and deletes the thumbnail with the original", async () => {
  const [uploadApi, deliveryApi, adminApi, schema] = await Promise.all([
    source("app/api/photos/route.ts"),
    source("app/api/photos/[id]/route.ts"),
    source("app/api/admin/photos/route.ts"),
    source("db/schema.ts"),
  ]);

  assert.match(uploadApi, /thumbnail_object_key/);
  assert.match(uploadApi, /BUCKET\.put\(thumbnailObjectKey/);
  assert.match(deliveryApi, /variant === "thumbnail"/);
  assert.match(adminApi, /BUCKET\.delete\(photo\.thumbnail_object_key\)/);
  assert.match(schema, /thumbnailObjectKey: text\("thumbnail_object_key"\)/);
});
