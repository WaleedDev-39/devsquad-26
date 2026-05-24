import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-symptoms')
  getTopSymptoms() {
    return this.analyticsService.getTopSymptoms();
  }

  @Get('top-categories')
  getTopCategories() {
    return this.analyticsService.getTopCategories();
  }

  @Get('total')
  getTotalQueries() {
    return this.analyticsService.getTotalQueries();
  }

  @Get('recent')
  getRecentQueries() {
    return this.analyticsService.getRecentQueries();
  }
}
