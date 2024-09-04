import { crx, type ManifestV3Export } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { CODE_CLIMBER_API_URL } from "./src/utils/constants";

import fs from "fs";
import devManifest from "./manifest.dev.json";
import manifest from "./manifest.json";
import pkg from "./package.json";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");
const browserPolyfillLocation = resolve(
  __dirname,
  "node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
);

const IS_DEV = process.env.__DEV__ === "true";

const createManifest = (browser: 'chrome' | 'firefox'): ManifestV3Export => {
  const baseManifest = {
    ...manifest,
    ...(IS_DEV ? devManifest : {}),
    name: IS_DEV ? `DEV: ${manifest.name}` : manifest.name,
    version: pkg.version,
  };

  if (browser === 'firefox') {
    // Firefox-specific adjustments
    const { service_worker, ...rest } = baseManifest.background;
    baseManifest.background = {
      ...rest,
      service_worker: 'src/routes/background/background.ts',
      type: 'module'
    };
  }

  return baseManifest as ManifestV3Export;
};

function browserPolyfill() {
  return {
    name: "browser-polyfill",
    resolveId(source: string) {
      return source === "virtual-module" ? source : null;
    },
    renderStart() {
      fs.copyFile(
        browserPolyfillLocation,
        resolve(root, "browser-polyfill.js"),
        () => console.log(`Copied browser-polyfill.js to src directory`),
      );
    },
  };
}

export default defineConfig(({ mode, ...rest }) => {
  process.env = {
    ...process.env,
    API_URL: process.env.API_URL ?? CODE_CLIMBER_API_URL,
    CURRENT_USER_API_URL: "/users/current",
    HEARTBEAT_API_URL: "/users/current/heartbeats",
    SUMMARIES_API_URL: "/users/current/summaries",
    NODE_ENV: process.env.__DEV__ !== "true" ? "production" : "development",
  };
  const buildTarget = process.env.BUILD_TARGET;

  return {
    resolve: {
      alias: {
        "@src": root,
      },
    },
    plugins: [
      react(),
      crx({
        manifest: createManifest(buildTarget as 'chrome' | 'firefox'),
      }),
      browserPolyfill(),
    ],
    publicDir,
    build: {
      outDir: resolve(outDir, buildTarget as 'chrome' | 'firefox'),
      sourcemap: IS_DEV,
      emptyOutDir: !IS_DEV,
    },
  };
});
