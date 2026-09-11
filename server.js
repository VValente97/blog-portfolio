const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = process.cwd();
const types = {
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const publicFiles = new Set([
  'index.html',
  'privacidade.html',
  'termos.html',
  'robots.txt',
  'app.css',
  'script.js',
]);
const publicAssetExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);

function isPublicFile(relative, extension) {
  if (publicFiles.has(relative)) return true;
  return relative.startsWith('assets/') && publicAssetExtensions.has(extension);
}

const server = http.createServer((request, response) => {
  let requested;
  try {
    requested = decodeURIComponent(request.url.split('?')[0]);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return response.end('Bad request');
  }
  const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  const relativeToRoot = path.relative(root, file);
  const extension = path.extname(file).toLowerCase();
  const hasHiddenSegment = relative.split('/').some((segment) => segment.startsWith('.'));

  if (
    relativeToRoot.startsWith('..') ||
    path.isAbsolute(relativeToRoot) ||
    hasHiddenSegment ||
    !isPublicFile(relative, extension)
  ) {
    response.writeHead(403);
    return response.end('Forbidden');
  }

  fs.readFile(file, (error, content) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return response.end('Not found');
    }
    const isDocument = extension === '.html';
    const headers = {
      'Content-Type': types[extension] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Content-Security-Policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'",
      'Cache-Control': isDocument ? 'no-cache' : 'public, max-age=604800'
    };
    const canCompress = /\.(?:html|css|js|xml|txt)$/.test(extension) && /\bgzip\b/.test(request.headers['accept-encoding'] || '');

    if (!canCompress) {
      response.writeHead(200, headers);
      return response.end(content);
    }

    zlib.gzip(content, (gzipError, compressed) => {
      if (gzipError) {
        response.writeHead(200, headers);
        return response.end(content);
      }
      response.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
      response.end(compressed);
    });
  });
});

const host = process.env.BLOG_HOST === '0.0.0.0' ? '0.0.0.0' : '127.0.0.1';

server.listen(4173, host, () => {
  console.log(`Blog running at http://${host}:4173`);
});
