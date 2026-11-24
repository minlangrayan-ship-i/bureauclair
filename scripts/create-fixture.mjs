import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
if (process.platform !== "win32")
  throw new Error(
    "Ce générateur utilise la voix française locale de Windows. Fournissez un WAV français non sensible sur les autres plateformes.",
  );
fs.mkdirSync(".runtime", { recursive: true });
const target = path.resolve(".runtime/test-fr.wav").replaceAll("'", "''");
const code = `Add-Type -AssemblyName System.Speech; $voice = New-Object System.Speech.Synthesis.SpeechSynthesizer; try { $voice.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::NotSet, [System.Speech.Synthesis.VoiceAge]::NotSet, 0, [System.Globalization.CultureInfo]::new('fr-FR')); $voice.SetOutputToWaveFile('${target}'); $voice.Speak('Bonjour. La réunion commence à neuf heures. Nous préparons les documents pour demain.'); } finally { $voice.Dispose(); }`;
execFileSync(
  "powershell.exe",
  ["-NoProfile", "-NonInteractive", "-Command", code],
  { windowsHide: true, stdio: "inherit" },
);
const wav = fs.readFileSync(".runtime/test-fr.wav");
let offset = 12;
let dataOffset = -1;
let dataSize = 0;
while (offset + 8 < wav.length) {
  const name = wav.toString("ascii", offset, offset + 4),
    length = wav.readUInt32LE(offset + 4);
  if (name === "data") {
    dataOffset = offset;
    dataSize = length;
    break;
  }
  offset += 8 + length + (length % 2);
}
if (dataOffset < 0) throw new Error("WAV sans données PCM.");
const header = Buffer.from(wav.subarray(0, dataOffset + 8));
const samples = wav.subarray(dataOffset + 8, dataOffset + 8 + dataSize);
header.writeUInt32LE(dataSize * 10, dataOffset + 4);
header.writeUInt32LE(header.length + dataSize * 10 - 8, 4);
fs.writeFileSync(
  ".runtime/test-long.wav",
  Buffer.concat([header, ...Array(10).fill(samples)]),
);
console.log(
  "Deux WAV de test français créés localement, sans données réelles.",
);
