import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean),
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('SHOP.CO API')
    .setDescription('E-Commerce API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 SHOP.CO Backend v2.1 (OAuth Fixed) running on http://localhost:${port}`);
  console.log(`🔑 JWT_SECRET configured: ${!!process.env.JWT_SECRET}`);
  console.log(`🔑 GOOGLE_CLIENT_ID configured: ${!!process.env.GOOGLE_CLIENT_ID}`);
  console.log(`🌐 FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  console.log(`🌐 API_URL: ${process.env.API_URL}`);
}
bootstrap();
