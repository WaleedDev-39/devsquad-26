import { Module } from '@nestjs/common';
import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';
import { ProductsModule } from '../products/products.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [ProductsModule, AnalyticsModule],
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService],
})
export class SymptomCheckerModule {}
