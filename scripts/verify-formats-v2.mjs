import { chromium } from "@playwright/test";
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const sandbox = {};
vm.runInNewContext(
  fs.readFileSync("node_modules/lamejs/lame.all.js", "utf8"),
  sandbox,
);
const wav = fs.readFileSync(".runtime/test-fr.wav");
const header = sandbox.lamejs.WavHeader.readHeader(
  new DataView(wav.buffer, wav.byteOffset, wav.byteLength),
);
const samples = new Int16Array(
  wav.buffer,
  wav.byteOffset + header.dataOffset,
  header.dataLen / 2,
);
const encoder = new sandbox.lamejs.Mp3Encoder(
  header.channels,
  header.sampleRate,
  64,
);
const chunks = [];
for (let i = 0; i < samples.length; i += 1152) {
  const data = encoder.encodeBuffer(samples.subarray(i, i + 1152));
  if (data.length) chunks.push(Buffer.from(data));
}
chunks.push(Buffer.from(encoder.flush()));
fs.writeFileSync(".runtime/test-fr.mp3", Buffer.concat(chunks));
const browser = await chromium.launch({
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
const report = { date: new Date().toISOString(), checks: [] };
try {
  const page = await browser.newPage();
  page.on("dialog", d=>d.accept());
  await page.goto("http://127.0.0.1:4175/studio");
  await page.getByRole("checkbox").check();
  const encoded = await page.evaluate(async (base64) => {
    const mime = ["audio/mp4;codecs=mp4a.40.2", "audio/mp4"].find((m) =>
      MediaRecorder.isTypeSupported(m),
    );
    if (!mime)
      return {
        unsupported: "Encodage AAC / MP4 non disponible dans MediaRecorder.",
      };
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const ac = new AudioContext();
    try {
      const audio = await ac.decodeAudioData(bytes.buffer);
      const destination = ac.createMediaStreamDestination();
      const source = ac.createBufferSource();
      source.buffer = audio;
      source.connect(destination);
      const recorder = new MediaRecorder(destination.stream, {
        mimeType: mime,
      });
      const blobs = [];
      recorder.ondataavailable = (e) => blobs.push(e.data);
      const stopped = new Promise((resolve) => {
        recorder.onstop = resolve;
      });
      recorder.start();
      source.start();
      await new Promise((resolve) => {
        source.onended = resolve;
      });
      recorder.stop();
      await stopped;
      const blob = new Blob(blobs, { type: mime });
      const data = new Uint8Array(await blob.arrayBuffer());
      let binary = "";
      for (const v of data) binary += String.fromCharCode(v);
      destination.stream.getTracks().forEach((t) => t.stop());
      return { base64: btoa(binary), mime };
    } finally {
      await ac.close();
    }
  }, wav.toString("base64"));
  if (encoded.base64)
    fs.writeFileSync(
      ".runtime/test-fr.m4a",
      Buffer.from(encoded.base64, "base64"),
    );
  else
    report.checks.push({
      format: "M4A",
      status: "non testé",
      reason: encoded.unsupported,
    });
  await page.getByRole("button", { name: "Charger le moteur local" }).click();
  await page.waitForFunction(
    () =>
      document
        .querySelector(".engine-status")
        ?.textContent?.includes("Moteur CPU prêt"),
    {},
    { timeout: 180000 },
  );
  for (const format of ["wav", "mp3", ...(encoded.base64 ? ["m4a"] : [])]) {
    await page
      .locator("#audio-file")
      .setInputFiles(`.runtime/test-fr.${format}`);
    await page
      .getByRole("button", { name: "Transcrire cet audio", exact: true })
      .click();
    await page
      .getByLabel("Transcription à relire et corriger")
      .waitFor({ timeout: 90000 });
    const text = await page
      .getByLabel("Transcription à relire et corriger")
      .inputValue();
    assert.match(text, /réunion/i);
    assert.match(await page.locator('.selected-file strong').innerText(), new RegExp('\\.'+format+'$'));
    await page.locator('audio').evaluate(a=>{a.currentTime=2});
    const details=page.locator('.segment-details');if(!(await details.getAttribute('open')))await details.locator('summary').click();
    await details.locator('button').first().click();
    assert.ok((await page.locator('audio').evaluate(a=>a.currentTime))<0.25,'timestamp seeks to original segment start');

    report.checks.push({
      format,
      status: "transcription réussie",
      text,
      bytes: fs.statSync(`.runtime/test-fr.${format}`).size,
    });
  }
  fs.writeFileSync("docs/v2/formats.json", JSON.stringify(report, null, 2));
  console.log(report);
} catch (e) {
  report.failure = e.stack;
  fs.writeFileSync("docs/v2/formats.json", JSON.stringify(report, null, 2));
  throw e;
} finally {
  await browser.close();
}
