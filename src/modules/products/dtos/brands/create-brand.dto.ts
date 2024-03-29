// NestJS modules
import { ApiProperty } from '@nestjs/swagger';

// Third-party libraries
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Name of the brand. Should be unique',
    minLength: 3,
    maxLength: 30,
    example: 'Apple',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;

  @ApiProperty({
    description: 'Description of the brand',
    minLength: 15,
    maxLength: 255,
    example:
      'A multinational technology company known for its iconic products, including the iPhone, iPad, Mac, and innovative software solutions',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(255)
  readonly description: string;

  @ApiProperty({
    description: 'ID of the image',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  readonly imageId: number;
}
