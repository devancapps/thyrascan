const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8082;
const ROOT = '/Users/devancapps/Desktop/SafeScanSystems/ThyraScan';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? '/asset-preview.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  process.stdout.write('Server running on port ' + PORT + '\n');
});
