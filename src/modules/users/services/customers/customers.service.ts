// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Entity imports
import { Customer } from '../../entities/customer.entity';

// DTO imports
import { CreateCustomerDto } from '../../dtos/customers/create-customer.dto';
import { UpdateCustomerDto } from '../../dtos/customers/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  findAll() {
    return this.customerRepo.find();
  }

  async findOne(id: number) {
    const customer = await this.customerRepo.findOneBy({ id });
    if (!customer) throw new NotFoundException(`Customer #${id} not Found`);
    return customer;
  }

  async create(payload: CreateCustomerDto) {
    const newCustomer = this.customerRepo.create(payload);
    await this.customerRepo.save(newCustomer);
    return {
      message: 'Customer created successfully',
      data: newCustomer,
    };
  }

  async update(id: number, payload: UpdateCustomerDto) {
    const customerFound = await this.findOne(id);
    this.customerRepo.merge(customerFound, payload);
    const updatedResult = await this.customerRepo.save(customerFound);

    return {
      message: 'Customer updated successfully',
      data: updatedResult,
    };
  }

  async delete(id: number) {
    const deletedCustomer = await this.findOne(id);
    await this.customerRepo.delete(id);

    return {
      message: 'Customer deleted successfully',
      data: deletedCustomer,
    };
  }
}
