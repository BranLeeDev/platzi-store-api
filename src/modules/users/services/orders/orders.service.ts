// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Entity imports
import { Order } from '../../entities/order.entity';
import { Customer } from '../../entities/customer.entity';

// DTO imports
import { CreateOrderDto } from '../../dtos/orders/create-order.dto';
import { UpdateOrderDto } from '../../dtos/orders/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  findAll() {
    return this.orderRepo.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) throw new NotFoundException(`Order #${id} not Found`);
    return order;
  }

  async create(payload: CreateOrderDto) {
    const newOrder = new Order();
    if (payload.customerId) {
      const customer = await this.customerRepo.findOneBy({
        id: payload.customerId,
      });
      newOrder.customer = customer;
    }
    await this.orderRepo.save(newOrder);

    return {
      message: 'Order created successfully',
      data: newOrder,
    };
  }

  async update(id: number, payload: UpdateOrderDto) {
    const orderFound = await this.orderRepo.findOneBy({ id });
    if (payload.customerId) {
      const customer = await this.customerRepo.findOneBy({ id });
      orderFound.customer = customer;
    }
    const updatedResult = await this.orderRepo.save(orderFound);

    return {
      message: 'Order updated successfully',
      data: updatedResult,
    };
  }

  async delete(id: number) {
    const deletedResult = await this.findOne(id);
    await this.orderRepo.delete(id);

    return {
      message: 'Order deleted successfully',
      data: deletedResult,
    };
  }
}
