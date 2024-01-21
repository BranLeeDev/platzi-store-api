import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Name of the brand',
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
}
