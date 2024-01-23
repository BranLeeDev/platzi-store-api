import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  @IsInt()
  customerId: number;
}
