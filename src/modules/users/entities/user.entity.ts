// Third-party libraries
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

// Entities
import { Base, Customer } from './index';

// Type imports
import { ROLES } from '../types/enums';

@Entity({ name: 'users' })
export class User extends Base {
  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({
    type: 'enum',
    enum: ROLES,
    default: ROLES.CUSTOMER,
  })
  role: ROLES;

  @OneToOne(() => Customer, (customer) => customer.user, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
