import * as esbuild from "esbuild";
import * as fs from "fs/promises";
import { dtsPlugin } from "esbuild-plugin-d.ts";

/** @type {esbuild.BuildOptions} */
const config = {
  entryPoints: ["./src/*.ts"],
  outdir: "./.build",
  minify: false,
  target: "esnext",
  format: "esm",
  bundle: true,
  splitting: true,
  treeShaking: true,
  chunkNames: "gen-[hash].[ext]",
  external: [
    "three",
    "postprocessing",
    "@tweakpane/plugin-essentials",
    "@tweakpane/core",
    "tweakpane",
  ],
  plugins: [dtsPlugin()],
  logLevel: "debug",
};

async function dev() {
  const ctx = await esbuild.context(config);
  await ctx.watch();
}

async function build() {
  await fs.rm("./.build", { recursive: true }).catch(() => {});
  console.log("Building...");
  const t = performance.now();
  await esbuild.build(config);
  console.log("Build completed in", (performance.now() - t).toFixed(0), "ms");
}

if (process.argv.includes("--dev")) {
  dev();
} else {
  build();
}
