// Third-party libraries
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

// Entities
import { Base, User, Order } from './index';

// Type imports
import { GENDERS } from '../types/enums';

@Entity({ name: 'customers' })
export class Customer extends Base {
  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 40,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 40,
  })
  lastName: string;

  @Column({
    type: 'enum',
    enum: GENDERS,
  })
  gender: GENDERS;

  @Column({
    name: 'date_of_birth',
    type: 'date',
  })
  dateOfBirth: Date;

  @OneToOne(() => User, (user) => user.customer, { nullable: true })
  user: User;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
