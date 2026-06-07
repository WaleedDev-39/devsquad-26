import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ProductsModule } from './products/products.module';
import { SpeechModule } from './speech/speech.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-chatbot',
      {
        serverSelectionTimeoutMS: 5000, // Fail fast — don't hang past Vercel's 10s limit
        socketTimeoutMS: 10000,
        bufferCommands: false,          // Don't queue ops if disconnected
        family: 4,                      // Force IPv4 — avoids Atlas SRV/IPv6 issues on Vercel
        maxPoolSize: 5,                 // Small pool — serverless has many instances
      },
    ),
    ProductsModule,
    ChatModule,
    SpeechModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
