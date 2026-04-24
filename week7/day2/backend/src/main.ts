import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    await app.listen(process.env.PORT || 3001);
    console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 3001}`);
  }

  await app.init();
}

let cachedApp: any;

if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

export default async (req: any, res: any) => {
  try {
    if (!cachedApp) {
      console.log('Initializing NestJS app...');
      const app = await NestFactory.create(AppModule);
      app.setGlobalPrefix('api');
      app.enableCors({
        origin: '*',
        credentials: true,
      });
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
      await app.init();
      cachedApp = app.getHttpAdapter().getInstance();
      console.log('NestJS app initialized successfully');
    }
    return cachedApp(req, res);
  } catch (err) {
    console.error('ERROR during Vercel function invocation:', err);
    res.status(500).json({
      error: 'Internal Server Error during initialization',
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : null,
    });
  }
};
