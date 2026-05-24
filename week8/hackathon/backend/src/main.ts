import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { Request, Response } from 'express';

let appPromise: Promise<any> | null = null;

function createNestServer(): Promise<any> {
  if (!appPromise) {
    appPromise = NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] })
      .then(async (app) => {
        app.enableCors({
          origin: true,
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
          allowedHeaders: 'Content-Type, Authorization, Accept, Origin',
          credentials: true,
        });
        await app.init();
        return app.getHttpAdapter().getInstance();
      })
      .catch((err) => {
        // Reset so next invocation retries bootstrap
        appPromise = null;
        throw err;
      });
  }
  return appPromise;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    const server = await createNestServer();
    // Wrap in a Promise so Vercel waits for the response to fully finish
    await new Promise<void>((resolve, reject) => {
      res.on('finish', resolve);
      res.on('close', resolve);
      res.on('error', reject);
      server(req, res);
    });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[handler] Fatal error:', err?.message ?? err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ statusCode: 500, message: 'Internal server error' }));
    }
  }
}

// When run directly (e.g. `node dist/main.js`) start a local HTTP server.
if (require.main === module) {
  (async () => {
    const instance = await createNestServer();
    const port = process.env.PORT ?? 3001;
    instance.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening on ${port}`);
    });
  })();
}
