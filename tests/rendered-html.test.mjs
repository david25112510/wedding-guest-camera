import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the wedding identity in the document metadata", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  assert.match(layout, /Lidieyne & Alexandre/);
  assert.match(layout, /Registre e compartilhe os momentos/);
  assert.match(layout, /19\.09\.2026/);
});
