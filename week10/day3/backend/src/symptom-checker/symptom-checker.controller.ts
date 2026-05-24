import { Controller, Post, Body } from '@nestjs/common';
import { SymptomCheckerService } from './symptom-checker.service';
import { CheckSymptomDto } from './dto/check-symptom.dto';

@Controller('symptom-checker')
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @Post()
  async checkSymptom(@Body() dto: CheckSymptomDto) {
    return this.symptomCheckerService.analyzeSymptoms(dto);
  }
}
