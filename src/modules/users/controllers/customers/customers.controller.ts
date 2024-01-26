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

@ApiTags('customers')
@Controller('customers')
export class CustomersController extends BaseController {
  constructor(private readonly customersService: CustomersService) {
    super();
  }

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
  ) {
    try {
      const res = await this.customersService.update(
        customerId,
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

  @Delete(':customerId')
  @ApiOperation({
    summary: 'Delete customer by ID',
    description: 'Delete a specif customer by ID',
  })
  @ApiParam({
    name: 'customerId',
    type: 'number',
    description: 'ID of the customer to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async deleteCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.customersService.delete(customerId);
      return {
        message: 'Customer deleted successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }
}
