// Third-party libraries
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

// Entities
import { Base } from '../../common/base.entity';
import { Order } from './index';
import { Product } from '../../products/entities';

@Entity({ name: 'orders_products' })
export class OrderProduct extends Base {
  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.productsOrder)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
