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
import { CustomersService } from '../../services/customers/customers.service';

// DTO imports
import { CreateCustomerDto } from '../../dtos/customers/create-customer.dto';
import { UpdateCustomerDto } from '../../dtos/customers/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  getAllCustomers() {
    return this.customersService.findAll();
  }

  @Post()
  createCustomer(@Body() payload: CreateCustomerDto) {
    return this.customersService.create(payload);
  }

  @Get(':id')
  getCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, payload);
  }

  @Delete(':id')
  deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.delete(id);
  }
}
