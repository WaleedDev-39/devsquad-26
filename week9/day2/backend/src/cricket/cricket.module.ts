import { Module } from '@nestjs/common';
import { CricketController } from './cricket.controller';
import { CricketService } from './cricket.service';
import { SeedModule } from '../seed/seed.module';

@Module({
  imports: [SeedModule],
  controllers: [CricketController],
  providers: [CricketService],
})
export class CricketModule {}
