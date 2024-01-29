// NestJS modules
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

// Entities
import { Order } from '../../entities';

// DTOs
import { FilterOrdersDto } from '../../dtos';

// Services
import { OrdersService } from '../../services';

// Module imports
import { BaseController } from '../../../common/base.controller';

// Auth imports
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ROLES } from '../../types/enums';
import { PayloadToken } from 'src/modules/auth/types/interfaces';

@UseGuards(JwtAuthGuard)
@ApiTags('orders')
@Controller('orders')
export class OrdersController extends BaseController {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  @Roles(ROLES.ADMIN)
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
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async createOrder(@Req() req: Request, @Body() body: any) {
    try {
      this.validateEmptyBody(body);
      const payloadToken = req.user as PayloadToken;
      const userIdFromToken = payloadToken.sub;
      const res = await this.ordersService.create(userIdFromToken);
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
    @Req() req: Request,
  ) {
    try {
      this.validateEmptyBody(body);
      const payloadToken = req.user as PayloadToken;
      const res = await this.ordersService.findOne(orderId, payloadToken);
      return res;
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
    @Req() req: Request,
  ) {
    try {
      this.validateEmptyBody(body);
      const payloadToken = req.user as PayloadToken;
      const res = await this.ordersService.delete(orderId, payloadToken);
      return {
        message: 'Order deleted successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }
}
