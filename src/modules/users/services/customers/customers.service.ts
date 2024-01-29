// NestJS modules
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { PayloadToken } from 'src/modules/auth/types/interfaces';
import { ROLES } from '../../types/enums';

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

  async update(
    customerId: number,
    payloadToken: PayloadToken,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      const customerFound = await this.findOne(customerId);
      if (
        payloadToken.role !== ROLES.ADMIN &&
        customerFound.user.id !== payloadToken.sub
      ) {
        throw new UnauthorizedException(
          'You do not have the necessary permissions to update the information for this customer account',
        );
      }
      this.customerRepo.merge(customerFound, updateCustomerDto);
      const updatedCustomer = await this.customerRepo.save(customerFound);
      return updatedCustomer;
    } catch (error) {
      this.catchError(error);
    }
  }
}
