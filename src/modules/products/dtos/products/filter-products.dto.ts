import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

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
}
