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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Service imports
import { CustomersService } from '../../services/customers/customers.service';

// DTO imports
import { CreateCustomerDto } from '../../dtos/customers/create-customer.dto';
import { UpdateCustomerDto } from '../../dtos/customers/update-customer.dto';

// Entity imports
import { Customer } from '../../entities/customer.entity';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all customers',
    description: 'Retrieve a list of all customers',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all customers',
    type: [Customer],
  })
  getAllCustomers() {
    return this.customersService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a customer',
    description: 'Create a new customer',
  })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: Customer,
  })
  @ApiBody({ type: CreateCustomerDto })
  createCustomer(@Body() payload: CreateCustomerDto) {
    return this.customersService.create(payload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get customer by ID',
    description: 'Retrieve details of a specific customer by ID',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Customer details', type: Customer })
  getCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update customer by ID',
    description: 'Update details of a specific customer by ID',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: Customer,
  })
  @ApiBody({ type: UpdateCustomerDto })
  updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete customer by ID',
    description: 'Delete a specif customer by ID',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.delete(id);
  }
}
