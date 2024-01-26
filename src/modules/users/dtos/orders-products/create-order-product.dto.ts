import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderProductDto {
  @ApiProperty({
    description: 'ID of the order for the new product.',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly orderId: number;

  @ApiProperty({
    description: 'ID of the product to be added to the order.',
    example: 2,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly productId: number;

  @ApiProperty({
    description: 'Quantity of the product to be added to the order.',

    example: 3,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly quantity: number;
}
