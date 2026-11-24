import fs from "node:fs";
fs.mkdirSync("public/runtime", { recursive: true });
for (const name of [
  "ort-wasm-simd-threaded.jsep.mjs",
  "ort-wasm-simd-threaded.jsep.wasm",
]) {
  const source = `node_modules/@huggingface/transformers/dist/${name}`,
    target = `public/runtime/${name}`;
  if (
    !fs.existsSync(target) ||
    !fs.readFileSync(source).equals(fs.readFileSync(target))
  )
    fs.copyFileSync(source, target);
}
