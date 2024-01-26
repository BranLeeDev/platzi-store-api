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
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Entities
import { Order } from '../../entities';

// DTOs
import { CreateOrderDto, FilterOrdersDto, UpdateOrderDto } from '../../dtos';

// Services
import { OrdersService } from '../../services';

// Module imports
import { BaseController } from '../../../common/base.controller';

@ApiTags('orders')
@Controller('orders')
export class OrdersController extends BaseController {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Retrieve a list of all orders',
  })
  @ApiQuery({
    name: 'limit',
    description: 'The maximum number of orders to return',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    description: 'The number of orders to skip before starting to return items',
    required: false,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    type: [Order],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getAllOrders(
    @Query() filterOrdersDto: FilterOrdersDto,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.ordersService.findAll(filterOrdersDto);
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a order',
    description: 'Create a new order',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - The order data is invalid or the name does not meet the requirements',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const res = await this.ordersService.create(createOrderDto);
      return {
        message: 'Order created successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Get(':orderId')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieve details of a specific order by ID',
  })
  @ApiParam({
    name: 'orderId',
    type: 'number',
    description: 'ID of the order',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Order details', type: Order })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.ordersService.findOne(orderId);
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Patch(':orderId')
  @ApiOperation({
    summary: 'Update order by ID',
    description: 'Update details of a specific order by ID',
  })
  @ApiParam({
    name: 'orderId',
    type: 'number',
    description: 'ID of the order to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateOrderDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - The update data is invalid or incomplete',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found - The specified order ID does not exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async updateOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const res = await this.ordersService.update(orderId, updateOrderDto);
      return {
        message: 'Order updated successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Delete(':orderId')
  @ApiOperation({
    summary: 'Delete order by ID',
    description: 'Delete a specif order by ID',
  })
  @ApiParam({
    name: 'orderId',
    type: 'number',
    description: 'ID of the order to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  async deleteOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.ordersService.delete(orderId);
      return {
        message: 'Order deleted successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }
}
