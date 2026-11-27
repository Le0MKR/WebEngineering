import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Vite baut ohne Angabe nur index.html. Artwell hat vier Seiten,
// deshalb stehen hier alle als Einstiegspunkte.
export default defineConfig({
  // Relative Pfade, damit dist/ auch in einem Unterordner läuft (z. B. GitHub Pages).
  base: './',
  plugins: [tailwindcss()],
  // Der Bildserver des Art Institute antwortet bei „localhost“ mit 403.
  // Über die IPv6-Adresse [::1] kommen die Bilder an: http://[::1]:5173
  server: { host: '::1' },
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        ausstellungen: resolve(import.meta.dirname, 'ausstellungen.html'),
        ueber: resolve(import.meta.dirname, 'ueber.html'),
        danke: resolve(import.meta.dirname, 'danke.html'),
      },
    },
  },
});
