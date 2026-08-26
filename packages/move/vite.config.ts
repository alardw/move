import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

function combineCssPlugin(): Plugin {
  return {
    name: 'move-combine-css',
    apply: 'build',
    generateBundle(_outputOptions, bundle) {
      const decoder = new TextDecoder();
      const combined = Object.values(bundle)
        .filter((chunk): chunk is { type: 'asset'; fileName: string; source: string | Uint8Array } =>
          chunk.type === 'asset' && chunk.fileName.endsWith('.css') && chunk.fileName !== 'styles.css',
        )
        .map((asset) => {
          if (typeof asset.source === 'string') return asset.source;
          return decoder.decode(asset.source);
        })
        .join('\n');

      this.emitFile({
        type: 'asset',
        fileName: 'styles.css',
        source: combined,
      });
    },
  };
}

/**
 * Everything the consumer installs themselves stays external — read from
 * package.json so the list cannot drift from what is actually declared.
 */
const pkg = JSON.parse(readFileSync(resolve(dirname, 'package.json'), 'utf8')) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
const EXTERNAL_PACKAGES = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {}),
];

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      outDir: 'dist',
      rollupTypes: false
    }),
    combineCssPlugin(),
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: 'move-[local]-[hash:base64:5]'
    }
  },
  build: {
    lib: {
      // `spec` is its own entry so `move/spec` always emits. It is almost all
      // types, so rollup drops it when it is only reachable as a re-export.
      entry: {
        index: resolve(dirname, 'src/index.ts'),
        spec: resolve(dirname, 'src/spec.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      // DERIVED, never hand-listed. A hand-written allowlist is one omission
      // away from a broken publish: anything missing is resolved at OUR build
      // time, so rollup copies the package into dist/node_modules and rewrites
      // the import to a relative path. A path has no package name left for a
      // consumer's resolve.dedupe, resolve.alias or npm overrides to match, so
      // their only remedy is editing the tarball. `react/jsx-dev-runtime` was
      // the omission that shipped, and it crashed every consumer's production
      // build on load.
      external: (id: string) =>
        EXTERNAL_PACKAGES.some((name) => id === name || id.startsWith(`${name}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].mjs',
        assetFileNames: '[name].[ext]'
      }
    },
    sourcemap: true,
    cssCodeSplit: true
  },
});
