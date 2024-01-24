// NestJS modules
import { Body, Controller, Post } from '@nestjs/common';

// Service imports
import { OrdersProductsService } from '../../services/orders-products/orders-products.service';

// DTO imports
import { CreateOrderProductDto } from '../../dtos/orders-products/create-order-product.dto';

@Controller('orders-products')
export class OrdersProductsController {
  constructor(private readonly ordersProductsService: OrdersProductsService) {}

  @Post()
  create(@Body() payload: CreateOrderProductDto) {
    return this.ordersProductsService.create(payload);
  }
}
