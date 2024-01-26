// NestJS modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Entities
import { OrderProduct } from '../../entities';

// DTOs
import { CreateOrderProductDto } from '../../dtos';

// Services
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../../../products/services';

@Injectable()
export class OrdersProductsService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepo: Repository<OrderProduct>,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  async create(createOrderProductDto: CreateOrderProductDto) {
    const order = await this.ordersService.findOrderById(
      createOrderProductDto.orderId,
    );
    const product = await this.productsService.findProductById(
      createOrderProductDto.productId,
    );
    const productsOrder = new OrderProduct();
    productsOrder.order = order;
    productsOrder.product = product;
    productsOrder.quantity = createOrderProductDto.quantity;
    const createdOrderProduct = await this.orderProductRepo.save(productsOrder);
    return createdOrderProduct;
  }
}
