import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderProductDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly orderId: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly productId: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly quantity: number;
}
