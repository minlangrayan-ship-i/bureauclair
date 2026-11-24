import { env, pipeline } from "@huggingface/transformers";
env.allowLocalModels = false;
env.backends.onnx.wasm!.numThreads = 1;
env.backends.onnx.wasm!.wasmPaths = "/runtime/";
type ASR = (
  audio: Float32Array,
  options: Record<string, unknown>,
) => Promise<unknown>;
const loadPipeline = pipeline as unknown as (
  task: string,
  model: string,
  options: Record<string, unknown>,
) => Promise<ASR>;
let transcriber: ASR | undefined;
self.onmessage = async ({ data }) => {
  const start = performance.now();
  try {
    if (data.type === "load") {
      transcriber = await loadPipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny",
        {
          revision: "5332fcc35e32a33b86612b9a57a89be7906102b1",
          device: data.device || "wasm",
          dtype: "q8",
          progress_callback: (p: unknown) =>
            self.postMessage({ type: "progress", progress: p }),
        },
      );
      self.postMessage({ type: "ready", ms: performance.now() - start });
    } else if (data.type === "transcribe") {
      if (!transcriber) throw new Error("Moteur non chargé.");
      const result = await transcriber(data.audio, {
        language: data.language || "french",
        task: "transcribe",
        return_timestamps: true,
        chunk_length_s: 30,
        stride_length_s: 5,
      });
      self.postMessage({
        type: "result",
        result,
        ms: performance.now() - start,
      });
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
      ms: performance.now() - start,
    });
  }
};
