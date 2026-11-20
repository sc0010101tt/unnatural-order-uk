import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4173);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
    let safePath = decodeURIComponent(reqUrl.pathname);
    if (safePath === '/') safePath = '/index.html';

    const fullPath = path.resolve(__dirname, '.' + safePath);
    if (!fullPath.startsWith(__dirname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 // ACCESS DENIED');
      return;
    }

    const stat = await fs.stat(fullPath).catch(() => null);
    if (!stat || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 // TRANSMISSION NOT FOUND');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const content = await fs.readFile(fullPath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(content);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 // SYSTEM OVERRIDE ERROR');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  UNNATURAL ORDER // TRANSMISSION SERVER ACTIVE`);
  console.log(`  SIGNAL LOCKED -> http://127.0.0.1:${PORT}\n`);
});
