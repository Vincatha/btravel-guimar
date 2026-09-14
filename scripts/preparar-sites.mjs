import fs from 'node:fs';

// Sites admite dist como directorio público. Se conserva _site para Eleventy.
if (!fs.existsSync('_site/index.html')) throw new Error('Falta la web compilada');
fs.rmSync('dist', { recursive: true, force: true });
fs.cpSync('_site', 'dist', { recursive: true });
