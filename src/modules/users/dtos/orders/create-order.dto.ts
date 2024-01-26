import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer ID associated with the order',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  customerId: number;
}
