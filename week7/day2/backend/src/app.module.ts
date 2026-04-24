import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Subscriber } from './newsletter/subscriber.entity';

import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: join(process.cwd(), 'circlechain.sqlite'),
        entities: [User, Subscriber],
        synchronize: true,
      }),
    }),
    AuthModule,
    NewsletterModule,
    UsersModule,
  ],
})
export class AppModule {}
