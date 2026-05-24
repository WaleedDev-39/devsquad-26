import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { SymptomQuery, SymptomQuerySchema } from './schemas/symptom-query.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SymptomQuery.name, schema: SymptomQuerySchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
