import glsl from 'vite-plugin-glsl';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { defineConfig } from 'vite';

const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env;

export default defineConfig({
  root: 'src/',
  publicDir: '../static/',
  base: './',
  plugins: [glsl(), viteCommonjs()],
  server: {
    host: true,
    open: !isCodeSandbox, // Open if it's not a CodeSandbox
  },
  assetsInclude: ['**/*.glb'],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
