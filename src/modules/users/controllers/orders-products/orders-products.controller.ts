// NestJS modules
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Services
import { OrdersProductsService } from '../../services';

// DTOs
import { CreateOrderProductDto } from '../../dtos';

// Module imports
import { BaseController } from '../../../common/base.controller';

@ApiTags('orders-products')
@Controller('orders-products')
export class OrdersProductsController extends BaseController {
  constructor(private readonly ordersProductsService: OrdersProductsService) {
    super();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new order product',
    description: 'Create a new order product with the provided data',
  })
  @ApiBody({
    type: CreateOrderProductDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Order product created successfully',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - The provided data is invalid or does not meet the requirements',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred.',
  })
  async create(@Body() payload: CreateOrderProductDto) {
    try {
      const res = await this.ordersProductsService.create(payload);
      return {
        message: 'Order product created successfully.',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }
}
