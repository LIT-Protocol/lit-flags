import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig([
  {
    name: 'Import helper',
    entries: ['./src/index.js'],
    outDir: 'dist',
  },
  {
    name: 'CLI bin (bundled)',
    entries: ['./src/bin/flag-editor.js'],
    outDir: 'dist',
    rollup: {
      esbuild: {
        minify: true,
      },
    },
  },
]);
