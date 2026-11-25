export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function exportTxt(
  text: string,
  name = "bureauclair-transcription.txt",
) {
  download(new Blob([text], { type: "text/plain;charset=utf-8" }), name);
}
export async function exportDocx(
  text: string,
  name = "bureauclair-transcription.docx",
) {
  const { Document, Packer, Paragraph } = await import("docx");
  const doc = new Document({
    sections: [
      { children: text.split("\n").map((line) => new Paragraph(line)) },
    ],
  });
  download(await Packer.toBlob(doc), name);
}
