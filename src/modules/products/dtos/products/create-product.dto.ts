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

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    minLength: 3,
    maxLength: 50,
    example: 'Example product',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1500)
  @ApiProperty({
    description: 'Description on the product',
    minLength: 10,
    maxLength: 1500,
    example: 'This is an example brand description',
  })
  readonly description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 123.45,
  })
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty({
    description: 'Stock of the product',
    minimum: 1,
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  readonly stock: number;
}
