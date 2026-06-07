import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow localhost (any port) in dev AND the deployed Vercel frontend in production
  const ALLOWED_ORIGINS = [
    /^http:\/\/localhost:\d+$/,                           // any local port
    'https://week9-day3-cricket-memory-chatbot.vercel.app', // deployed frontend
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-side)
      if (!origin) return callback(null, true);
      const allowed = ALLOWED_ORIGINS.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin,
      );
      if (allowed) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🏏 Cricket Memory API running on http://localhost:${port}`);
}
bootstrap();
