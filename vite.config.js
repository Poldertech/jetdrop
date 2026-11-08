import { defineConfig } from 'vite';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Multi-page static site: every .html file in the project root is a page.
const root = import.meta.dirname;
const input = Object.fromEntries(
  readdirSync(root)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace(/\.html$/, ''), resolve(root, f)]),
);

export default defineConfig({
  base: './', // relative asset URLs, so the build works from any hosting path
  build: { rollupOptions: { input } },
});
