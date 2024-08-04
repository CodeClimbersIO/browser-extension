import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { crx, type ManifestV3Export } from "@crxjs/vite-plugin";
import { CODE_CLIMBER_API_URL } from "./src/utils/constants";

import manifest from "./manifest.json";
import devManifest from "./manifest.dev.json";
import pkg from "./package.json";
import fs from "fs";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");
const browserPolyfillLocation = resolve(
  __dirname,
  "node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
);

const IS_DEV = process.env.__DEV__ === "true";

const extensionManifest = {
  ...manifest,
  ...(IS_DEV ? devManifest : {}),
  name: IS_DEV ? `DEV: ${manifest.name}` : manifest.name,
  version: pkg.version,
} as ManifestV3Export;

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
        () => console.log(`Deleted dev-icon-32.png frm prod build`),
      );
    },
  };
}

export default defineConfig(() => {
  process.env = {
    ...process.env,
    API_URL: CODE_CLIMBER_API_URL,
    CURRENT_USER_API_URL: "/users/current",
    HEARTBEAT_API_URL: "/users/current/heartbeats",
    SUMMARIES_API_URL: "/users/current/summaries",
    NODE_ENV: process.env.__DEV__ !== "true" ? "production" : "development",
  };
  return {
    resolve: {
      alias: {
        "@src": root,
      },
    },
    plugins: [
      react(),
      crx({
        manifest: extensionManifest,
      }),
      browserPolyfill(),
    ],
    publicDir,
    build: {
      outDir,
      sourcemap: IS_DEV,
      emptyOutDir: !IS_DEV,
    },
  };
});
