import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Cache the express instance to reuse it across serverless invocations
let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    
    nestApp.setGlobalPrefix('api');
    nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await nestApp.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

// For Vercel Serverless environment
export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  async function startLocal() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: 'http://localhost:3000', credentials: true });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 POS Backend running on http://localhost:${port}/api`);
  }
  startLocal();
}
