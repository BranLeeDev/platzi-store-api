// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Entities
import { Customer } from '../../entities';

// DTOs
import {
  CreateCustomerDto,
  FilterCustomersDto,
  UpdateCustomerDto,
} from '../../dtos';

// Module imports
import { BaseService } from '../../../common/base.service';

@Injectable()
export class CustomersService extends BaseService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {
    super();
  }

  async findAll(filterCustomersDto?: FilterCustomersDto) {
    try {
      if (filterCustomersDto) {
        const { limit, offset } = filterCustomersDto;
        const customersList = await this.customerRepo.find({
          take: limit,
          skip: offset,
        });
        return customersList;
      }
      const customersList = await this.customerRepo.find();
      return customersList;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findCustomerById(customerId: number) {
    try {
      const customer = await this.customerRepo.findOneBy({ id: customerId });
      if (!customer)
        throw new NotFoundException(`Customer #${customerId} not Found`);
      return customer;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findOne(customerId: number) {
    try {
      const customer = await this.customerRepo.findOne({
        where: { id: customerId },
        relations: ['user'],
      });
      if (!customer)
        throw new NotFoundException(`Customer #${customerId} not Found`);
      return customer;
    } catch (error) {
      this.catchError(error);
    }
  }

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const newCustomer = this.customerRepo.create(createCustomerDto);
      const createdCustomer = await this.customerRepo.save(newCustomer);
      return createdCustomer;
    } catch (error) {
      this.catchError(error);
    }
  }

  async update(customerId: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customerFound = await this.findCustomerById(customerId);
      this.customerRepo.merge(customerFound, updateCustomerDto);
      const updatedCustomer = await this.customerRepo.save(customerFound);
      return updatedCustomer;
    } catch (error) {
      this.catchError(error);
    }
  }

  async delete(customerId: number) {
    try {
      const deletedCustomer = await this.findOne(customerId);
      await this.customerRepo.delete(customerId);
      return deletedCustomer;
    } catch (error) {
      this.catchError(error);
    }
  }
}
