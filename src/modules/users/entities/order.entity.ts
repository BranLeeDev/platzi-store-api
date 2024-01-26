// Third-party libraries
import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

// Entities
import { Base } from '../../common/base.entity';
import { OrderProduct, Customer } from './index';

@Entity({ name: 'orders' })
export class Order extends Base {
  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Exclude()
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  productsOrder: OrderProduct[];

  @Expose()
  get products() {
    if (this.productsOrder) {
      return this.productsOrder
        .filter((item) => !!item)
        .map((item) => ({
          ...item.product,
          quantity: item.quantity,
          productsOrder: item.id,
        }));
    }
    return [];
  }

  @Expose()
  get total() {
    if (this.productsOrder) {
      return this.productsOrder
        .filter((item) => !!item)
        .reduce((prev, curr) => {
          return prev + curr.product.price * curr.quantity;
        }, 0);
    }
    return 0;
  }
}
