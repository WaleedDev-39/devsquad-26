import * as dns from 'dns';
// Override local buggy/restricting DNS to successfully resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (dynamic reflection to allow any deployment/local origin)
  app.enableCors({
    origin: (requestOrigin, callback) => {
      callback(null, requestOrigin || '*');
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`\n🚀 Research Assistant API running on: http://localhost:${port}`);
  console.log(`📚 Endpoints:`);
  console.log(`   POST   http://localhost:${port}/ask`);
  console.log(`   GET    http://localhost:${port}/queries`);
  console.log(`   GET    http://localhost:${port}/trace/:id`);
  console.log(`   POST   http://localhost:${port}/documents/upload`);
  console.log(`   GET    http://localhost:${port}/documents`);
  console.log(`   GET    http://localhost:${port}/documents/stats\n`);
}

bootstrap();
