import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    minLength: 3,
    maxLength: 50,
    example: 'Apple iPhone 13',
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
    example:
      'The latest iPhone with a stunning Super Retina XDR display and powerful A15 Bionic chip',
  })
  readonly description: string;

  @ApiProperty({
    description: 'Price of the product',
    minimum: 1.01,
    maximum: 9999999999.99,
    example: 999.99,
  })
  @IsNumber()
  @IsPositive()
  @Min(1.01)
  @Max(9999999999.99)
  readonly price: number;

  @ApiProperty({
    description: 'Stock of the product',
    minimum: 1,
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  readonly stock: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly brandId: number;

  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  readonly categoriesIds: number[];
}
