import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category. Should be unique',
    minLength: 3,
    maxLength: 30,
    example: 'Electronics',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;

  @ApiProperty({
    description: 'ID of the image for the category',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  readonly imageId: number;
}
