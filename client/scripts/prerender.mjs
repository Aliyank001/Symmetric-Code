import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
const clientRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = join(clientRoot, 'dist');

const vite = await createServer({
  configFile: join(clientRoot, 'vite.config.js'),
  root: clientRoot,
  ssr: { noExternal: ['react-helmet-async'] },
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const { render, prerenderRoutes } = await vite.ssrLoadModule('/src/entry-server.jsx');
  const template = await readFile(join(outputRoot, 'index.html'), 'utf8');

  for (const route of prerenderRoutes) {
    const { appHtml, helmet } = render(route);
    const metadata = [
      helmet.title.toString(), helmet.meta.toString(), helmet.link.toString(), helmet.script.toString(),
    ].filter(Boolean).join('\n    ');
    const html = template
      .replace(/<title>[^<]*<\/title>/, '')
      .replace(/\s*<meta name="description"[^>]*\/>/, '')
      .replace('</head>', `    ${metadata}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${appHtml}</div>`);
    const pagePath = route === '/' ? outputRoot : join(outputRoot, route.slice(1));
    await mkdir(pagePath, { recursive: true });
    await writeFile(join(pagePath, 'index.html'), html, 'utf8');
  }

  process.stdout.write(`Prerendered ${prerenderRoutes.length} routes.\n`);
} finally {
  await vite.close();
}
