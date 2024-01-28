// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Entities
import { Order } from '../../entities';

// DTOs
import { CreateOrderDto, FilterOrdersDto, UpdateOrderDto } from '../../dtos';

// Services
import { CustomersService } from '../index';
import { UsersService } from '../users/users.service';

// Module imports
import { BaseService } from 'src/modules/common/base.service';

@Injectable()
export class OrdersService extends BaseService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async findAll(filterOrdersDto?: FilterOrdersDto) {
    try {
      if (filterOrdersDto) {
        const { limit, offset } = filterOrdersDto;
        const ordersList = await this.orderRepo.find({
          take: limit,
          skip: offset,
        });
        return ordersList;
      }
      const ordersList = await this.orderRepo.find();
      return ordersList;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findOrderById(orderId: number) {
    try {
      const order = await this.orderRepo.findOneBy({
        id: orderId,
      });
      if (!order) throw new NotFoundException(`Order #${orderId} not Found`);
      return order;
    } catch (error) {
      this.catchError(error);
    }
  }

  async ordersByUser(userId: number) {
    const user = await this.usersService.findOne(userId);
    const customerId = user.customer.id;
    const ordersList = await this.orderRepo.find({
      where: { customer: { id: customerId } },
      relations: ['productsOrder.product'],
    });
    return ordersList;
  }

  async findOne(orderId: number) {
    try {
      const order = await this.orderRepo.findOne({
        where: { id: orderId },
        relations: ['productsOrder', 'productsOrder.product'],
      });
      if (!order) throw new NotFoundException(`Order #${orderId} not Found`);
      return order;
    } catch (error) {
      this.catchError(error);
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const newOrder = new Order();
      if (createOrderDto.customerId) {
        const customer = await this.customersService.findCustomerById(
          createOrderDto.customerId,
        );
        newOrder.customer = customer;
      }
      const createdOrder = await this.orderRepo.save(newOrder);
      return createdOrder;
    } catch (error) {
      this.catchError(error);
    }
  }

  async update(orderId: number, updateOrderDto: UpdateOrderDto) {
    try {
      const orderFound = await this.findOrderById(orderId);
      if (updateOrderDto.customerId) {
        const customer = await this.customersService.findCustomerById(
          updateOrderDto.customerId,
        );
        orderFound.customer = customer;
      }
      const updatedOrder = await this.orderRepo.save(orderFound);
      return updatedOrder;
    } catch (error) {
      this.catchError(error);
    }
  }

  async delete(orderId: number) {
    try {
      const deletedOrder = await this.findOrderById(orderId);
      await this.orderRepo.delete(orderId);
      return deletedOrder;
    } catch (error) {
      this.catchError(error);
    }
  }
}
