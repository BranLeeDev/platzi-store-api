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
  readonly limit?: number;

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
  readonly offset?: number;

  @ApiProperty({
    description: 'The minimum price of products to filter',
    minimum: 0,
    example: 100,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly minPrice?: number;

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
  readonly maxPrice?: number;
}
