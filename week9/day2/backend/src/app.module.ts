import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CricketModule } from './cricket/cricket.module';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CricketModule,
    SeedModule,
  ],
})
export class AppModule {}
