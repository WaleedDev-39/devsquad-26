import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';

export class CreateRawMaterialDto {
  @IsString()
  name: string;

  @IsEnum(['g', 'ml', 'pcs', 'kg', 'l', 'oz'])
  unit: string;

  @IsNumber()
  @Min(0)
  currentStock: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumStockAlert?: number;
}

export class UpdateRawMaterialDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['g', 'ml', 'pcs', 'kg', 'l', 'oz'])
  unit?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumStockAlert?: number;
}

export class RestockRawMaterialDto {
  @IsNumber()
  @Min(0)
  quantity: number;
}
