import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class MemoDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number | null;
}
