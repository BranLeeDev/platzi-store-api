import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { OrderProduct } from '../../entities/order-product.entity';
import { CreateOrderProductDto } from '../../dtos/orders-products/create-order-product.dto';

@Injectable()
export class OrdersProductsService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepo: Repository<OrderProduct>,
  ) {}

  async create(payload: CreateOrderProductDto) {
    const order = await this.orderRepo.findOneBy({ id: payload.orderId });
    const product = await this.productRepo.findOneBy({ id: payload.productId });
    const productsOrder = new OrderProduct();
    productsOrder.order = order;
    productsOrder.product = product;
    productsOrder.quantity = payload.quantity;

    return this.orderProductRepo.save(productsOrder);
  }
}
