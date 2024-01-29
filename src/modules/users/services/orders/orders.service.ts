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
import { Order } from '../../entities';

// DTOs
import { FilterOrdersDto } from '../../dtos';

// Services
import { CustomersService } from '../index';
import { UsersService } from '../users/users.service';

// Module imports
import { BaseService } from '../../../common/base.service';
import { PayloadToken } from '../../../auth/types/interfaces';

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

  async findOne(orderId: number, payloadToken: PayloadToken) {
    try {
      const order = await this.orderRepo.findOne({
        where: { id: orderId },
        relations: ['customer'],
      });
      const user = await this.usersService.findOne(payloadToken.sub);
      if (!order) throw new NotFoundException(`Order #${orderId} not Found`);
      if (user.customer.id !== order.customer.id)
        throw new UnauthorizedException(
          'You do not have the necessary permissions to access this order',
        );
      return order;
    } catch (error) {
      this.catchError(error);
    }
  }

  async create(userIdFromToken: number) {
    try {
      const user = await this.usersService.findOne(userIdFromToken);
      const customer = await this.customersService.findCustomerById(
        user.customer.id,
      );
      const newOrder = new Order();
      newOrder.customer = customer;
      const createdOrder = await this.orderRepo.save(newOrder);
      return createdOrder;
    } catch (error) {
      this.catchError(error);
    }
  }

  async delete(orderId: number, payloadToken: PayloadToken) {
    try {
      const order = await this.orderRepo.findOne({
        where: { id: orderId },
        relations: ['customer'],
      });
      const user = await this.usersService.findOne(payloadToken.sub);
      if (!order) throw new NotFoundException(`Order #${orderId} not Found`);
      if (user.customer.id !== order.customer.id)
        throw new UnauthorizedException(
          'You do not have the necessary permissions to access this order',
        );
      const deletedOrder = await this.findOrderById(orderId);
      await this.orderRepo.delete(orderId);
      return deletedOrder;
    } catch (error) {
      this.catchError(error);
    }
  }
}
