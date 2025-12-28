import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsObject,
  IsNumber,
} from 'class-validator';

export class CreateHabitDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsEnum(['daily', 'weekly', 'monthly', 'custom'])
  @IsNotEmpty()
  repeatType: 'daily' | 'weekly' | 'monthly' | 'custom';

  @IsObject()
  @IsOptional()
  repeatConfig?: any;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class UpdateHabitDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsEnum(['daily', 'weekly', 'monthly', 'custom'])
  @IsOptional()
  repeatType?: 'daily' | 'weekly' | 'monthly' | 'custom';

  @IsObject()
  @IsOptional()
  repeatConfig?: any;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
