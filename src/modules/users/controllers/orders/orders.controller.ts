// NestJS modules
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

// Service imports
import { OrdersService } from '../../services/orders/orders.service';

// DTO imports
import { CreateOrderDto } from '../../dtos/orders/create-order.dto';
import { UpdateOrderDto } from '../../dtos/orders/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.findAll();
  }

  @Post()
  createOrder(@Body() payload: CreateOrderDto) {
    return this.ordersService.create(payload);
  }

  @Get(':id')
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, payload);
  }

  @Delete(':id')
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.delete(id);
  }
}
