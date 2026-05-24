import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CheckSymptomDto {
  @IsString()
  @IsNotEmpty()
  symptomText: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}
