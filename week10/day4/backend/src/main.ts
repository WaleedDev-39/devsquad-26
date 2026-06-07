import * as dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  // Only set up Swagger when not running as a Vercel serverless function
  // (Swagger adds overhead that can push past cold-start time limits)
  if (!process.env.VERCEL) {
    const config = new DocumentBuilder()
      .setTitle('Healthcare Chatbot API')
      .setDescription('Voice-enabled healthcare products chatbot')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.init();
  return server;
};

// Bootstrap promise — cached across warm invocations, prevents parallel race on cold start
let bootstrapPromise: Promise<typeof server> | null = null;

// Exported default handler consumed by api/index.ts for Vercel serverless
export default async function handler(req: any, res: any) {
  try {
    if (!bootstrapPromise) {
      bootstrapPromise = bootstrap();
    }
    const expressApp = await bootstrapPromise;
    return expressApp(req, res);
  } catch (err: any) {
    console.error('[MediBot] Handler bootstrap error:', err?.message || err);
    res.status(500).json({
      error: 'Server initialisation failed',
      message: err?.message || String(err),
    });
  }
}

// Local dev: start listening on a port when NOT on Vercel and NOT in production
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  (bootstrapPromise = bootstrap()).then(() => {
    server.listen(port, () => {
      console.log(`🚀 Healthcare Chatbot Backend running on http://localhost:${port}`);
      console.log(`📖 API Docs: http://localhost:${port}/api/docs`);
    });
  }).catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
}
