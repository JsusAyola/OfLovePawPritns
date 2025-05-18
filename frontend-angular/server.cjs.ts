import type { Request, Response, NextFunction } from 'express';

const { APP_BASE_HREF } = require('@angular/common');
const { CommonEngine } = require('@angular/ssr');
const express = require('express');
const path = require('path');
const bootstrap = require('./dist/pawprint/server/main.js');

function app() {
  const server = express();
  const distFolder = path.join(__dirname, 'dist/pawprint/browser');
  const indexHtml = path.join(distFolder, 'index.html');
  const engine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Static files
  server.get('**', express.static(distFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // SSR handler
  server.get('**', (req: Request, res: Response, next: NextFunction) => {
    engine.render({
      bootstrap,
      documentFilePath: indexHtml,
      url: req.originalUrl,
      publicPath: distFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl }
      ]
    })
    .then((html: string) => res.send(html))
    .catch((err: unknown) => next(err));
  });

  return server;
}

function run(): void {
  const port = Number(process.env["PORT"] || 4000);
  const server = app();
  server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
}

run();

module.exports = app;
