import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL || 'mongodb+srv://mwaleeda03_db_user:w9kFdIDR3hc7BwN4@cluster0.ufmqt2d.mongodb.net/ecom?appName=Cluster0'),
    ReviewsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
