import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' → relative asset URLs. Works on GitHub Pages subpath AND Cloudflare root.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true, port: 5179 },
});
