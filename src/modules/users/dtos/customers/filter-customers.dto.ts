import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class FilterCustomersDto {
  @ApiProperty({
    description: 'The maximum number of customers to return',
    minimum: 1,
    example: 10,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description:
      'The number of customers to skip before starting to return items',
    minimum: 0,
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;
}
