import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
try {
  const context = await browser.newContext({
    viewport: { width: 960, height: 540 },
    recordVideo: { dir: ".runtime/video", size: { width: 960, height: 540 } },
  });
  const page = await context.newPage();
  await page.setContent(
    `<!doctype html><html lang="fr"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#f4f1ff;color:#24344b;font:18px 'Segoe UI',sans-serif;padding:35px}h1{font:32px Georgia;margin:0 0 12px}p{font-size:15px;color:#5c6580}.window{background:white;border:1px solid #ddd3ee;border-radius:18px;padding:25px;margin-top:25px;display:flex;gap:20px}.folder{background:#faf9fd;border-radius:12px;border:1px solid #e8e1f4;padding:20px;width:50%;min-height:230px}h2{font-size:19px}.file{border:2px solid transparent;border-radius:9px;background:#fff;padding:16px;font-size:16px}.selected{border-color:#6755d7;background:#eee9ff}.caption{background:#6755d7;color:white;border-radius:10px;padding:16px;margin-top:22px;text-align:center}button{font:inherit;color:inherit;cursor:pointer}small{font-size:12px}</style><h1>Copier un fichier : le principe</h1><p>Schéma pédagogique BureauClair · Illustration, pas une capture de Windows</p><div class="window"><section class="folder"><h2>Dossier de départ</h2><button class="file" id="file">▤ Courrier.docx</button></section><section class="folder"><h2>Dossier de destination</h2><div id="destination"></div></section></div><div class="caption" id="caption">1. Sélectionnez le document à copier.</div><script>document.querySelector('#file').onclick=()=>document.querySelector('#file').classList.add('selected');</script></html>`,
  );
  await page.waitForTimeout(1800);
  await page.click("#file");
  await page.evaluate(
    () =>
      (document.querySelector("#caption").textContent =
        "2. Copiez : Ctrl + C. L’original reste à sa place."),
  );
  await page.waitForTimeout(2500);
  await page.evaluate(
    () =>
      (document.querySelector("#caption").textContent =
        "3. Ouvrez le dossier de destination, puis collez : Ctrl + V."),
  );
  await page.waitForTimeout(2200);
  await page.evaluate(() => {
    document.querySelector("#destination").innerHTML =
      '<div class="file selected">▤ Courrier.docx</div>';
    document.querySelector("#caption").textContent =
      "4. Vérifiez la copie : le document est présent dans les deux dossiers.";
  });
  await page.waitForTimeout(2800);
  const video = page.video();
  await page.close();
  await context.close();
  fs.mkdirSync("public/media", { recursive: true });
  fs.copyFileSync(await video.path(), "public/media/copier-un-fichier.webm");
  console.log("Démonstration locale générée.");
} finally {
  await browser.close();
}
