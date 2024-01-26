import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  ValidateIf,
} from 'class-validator';

export class FilterProductsDto {
  @ApiProperty({
    description: 'The maximum number of products to return',
    minimum: 1,
    example: 10,
  })
  @IsPositive()
  @IsNumber()
  @IsInt()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description:
      'The number of products to skip before starting to return items',
    minimum: 0,
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;

  @ApiProperty({
    description: 'The minimum price of products to filter',
    minimum: 0,
    example: 100,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: 'The maximum price of products to filter',
    required: false,
    minimum: 0,
    example: 600,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @ValidateIf((item) => item.minPrice)
  maxPrice?: number;
}
