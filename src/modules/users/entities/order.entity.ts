// Third-party libraries
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

// Entities
import { Base, OrderProduct, Customer } from './index';

@Entity({ name: 'orders' })
export class Order extends Base {
  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  productsOrder: OrderProduct[];
}
