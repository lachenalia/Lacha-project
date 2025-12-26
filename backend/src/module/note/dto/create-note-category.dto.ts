import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNoteCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  color!: string;
}
