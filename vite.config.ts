import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "node:fs";
const csp =
  "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; connect-src 'self' https://huggingface.co https://*.huggingface.co https://*.hf.co; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    {
      name: "local-runtime-in-dev",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const name = (req.url || "").split("?")[0];
          if (name === "/runtime/ort-wasm-simd-threaded.jsep.mjs") {
            res.setHeader("Content-Type", "text/javascript");
            fs.createReadStream(
              "public/runtime/ort-wasm-simd-threaded.jsep.mjs",
            ).pipe(res);
          } else next();
        });
      },
    },
    {
      name: "production-security",
      transformIndexHtml(html) {
        return command === "build"
          ? html.replace(
              "<head>",
              `<head><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="referrer" content="no-referrer">`,
            )
          : html;
      },
    },
    VitePWA({
      registerType: "prompt",
      injectRegister: null,
      includeAssets: [],
      manifest: {
        name: "BureauClair — Le bureau en plus simple",
        short_name: "BureauClair",
        description: "Guides bureautiques et outils locaux, sans compte.",
        lang: "fr",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#faf9f6",
        theme_color: "#6755d7",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        dontCacheBustURLsMatching: /^assets\/.*-[\w-]{8}\./,
        globPatterns: ["**/*.{js,css,html,svg,png,webp,json}"],
        globIgnores: ["**/*worker*", "**/*transformers*", "**/*ort*"],
        navigateFallback: "/index.html",
        maximumFileSizeToCacheInBytes: 1500000,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: { sourcemap: false, minify: "esbuild", chunkSizeWarningLimit: 1600 },
  worker: { format: "es" },
  server: {
    watch: {
      // Windows scanners can briefly lock new assets; polling avoids EBUSY crashes.
      usePolling: process.platform === "win32",
      interval: 300,
      ignored: [
        "**/public/runtime/**",
        "**/playwright-report/**",
        "**/test-results/**",
        "**/.runtime/**",
        "**/docs/**",
        "**/references/**",
        "**/reference-analysis/**",
      ],
    },
    headers: { "X-Content-Type-Options": "nosniff" },
  },
}));
