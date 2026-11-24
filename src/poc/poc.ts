let worker: Worker;
const output = document.querySelector("#result")!;
const make = () => {
  worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  });
  worker.onmessage = ({ data }) => {
    output.textContent = JSON.stringify(data, null, 2);
    (window as unknown as { lastMessage: unknown }).lastMessage = data;
  };
};
make();
document.querySelector("#load")!.addEventListener("click", () =>
  worker.postMessage({
    type: "load",
    device: new URLSearchParams(location.search).get("device") || "wasm",
  }),
);
document.querySelector("#cancel")!.addEventListener("click", () => {
  worker.terminate();
  make();
  output.textContent = "Annulé";
});
document.querySelector("#run")!.addEventListener("click", async () => {
  const file = (document.querySelector("#audio") as HTMLInputElement)
    .files?.[0];
  if (!file) return;
  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData(await file.arrayBuffer());
    const offline = new OfflineAudioContext(
      1,
      Math.ceil(decoded.duration * 16000),
      16000,
    );
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const rendered = await offline.startRendering();
    const samples = rendered.getChannelData(0);
    worker.postMessage({ type: "transcribe", audio: samples }, [
      samples.buffer,
    ]);
  } finally {
    await context.close();
  }
});
