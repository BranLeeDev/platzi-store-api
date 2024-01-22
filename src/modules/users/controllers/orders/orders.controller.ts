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
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

// Service imports
import { OrdersService } from '../../services/orders/orders.service';

// DTO imports
import { CreateOrderDto } from '../../dtos/orders/create-order.dto';
import { UpdateOrderDto } from '../../dtos/orders/update-order.dto';

// Entity imports
import { Order } from '../../entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Retrieve a list of all orders',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    type: [Order],
  })
  getAllOrders() {
    return this.ordersService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a order',
    description: 'Create a new order',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  createOrder(@Body() payload: CreateOrderDto) {
    return this.ordersService.create(payload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve details of a specific order by ID',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Order details', type: Order })
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update order by ID',
    description: 'Update details of a specific order by ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
  })
  @ApiBody({
    type: UpdateOrderDto,
  })
  updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete order by ID',
    description: 'Delete a specif order by ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.delete(id);
  }
}
