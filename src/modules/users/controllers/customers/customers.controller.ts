// NestJS modules
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

// Entities
import { Customer } from '../../entities';

// DTOs
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  FilterCustomersDto,
} from '../../dtos';

// Services
import { CustomersService } from '../../services/customers/customers.service';

// Module imports
import { BaseController } from '../../../common/base.controller';

// Auth imports
import { Public } from '../../../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth/jwt-auth.guard';
import { PayloadToken } from 'src/modules/auth/types/interfaces';

@UseGuards(JwtAuthGuard)
@ApiTags('customers')
@Controller('customers')
export class CustomersController extends BaseController {
  constructor(private readonly customersService: CustomersService) {
    super();
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all customers',
    description: 'Retrieve a list of all customers',
  })
  @ApiQuery({
    name: 'limit',
    description: 'The maximum number of customers to return',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    description:
      'The number of customers to skip before starting to return items',
    required: false,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'List of all customers',
    type: [Customer],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getAllCustomers(
    @Query() filterCustomersDto: FilterCustomersDto,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.customersService.findAll(filterCustomersDto);
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Create a customer',
    description: 'Create a new customer',
  })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: Customer,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - The customer data is invalid or the name does not meet the requirements',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const res = await this.customersService.create(createCustomerDto);
      return {
        message: 'Customer created successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Public()
  @Get(':customerId')
  @ApiOperation({
    summary: 'Get customer by ID',
    description: 'Retrieve details of a specific customer by ID',
  })
  @ApiParam({
    name: 'customerId',
    type: 'number',
    description: 'ID of the customer',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Customer details', type: Customer })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.customersService.findOne(customerId);
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Patch(':customerId')
  @ApiOperation({
    summary: 'Update customer by ID',
    description: 'Update details of a specific customer by ID',
  })
  @ApiParam({
    name: 'customerId',
    type: 'number',
    description: 'ID of the customer to update',
    example: 1,
  })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: Customer,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - The update data is invalid or incomplete',
  })
  @ApiResponse({
    status: 404,
    description:
      'Customer not found - The specified customer ID does not exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async updateCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Req() req: Request,
  ) {
    try {
      const payloadToken = req.user as PayloadToken;
      const res = await this.customersService.update(
        customerId,
        payloadToken,
        updateCustomerDto,
      );
      return {
        message: 'Customer updated successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }
}
