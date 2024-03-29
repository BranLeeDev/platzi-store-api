// Third-party libraries
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

// Entities
import { Base } from '../../common/base.entity';
import { Customer } from './index';

// Type imports
import { ROLES } from '../types/enums';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends Base {
  @Column({ type: 'varchar', length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({
    type: 'enum',
    enum: ROLES,
    default: ROLES.CUSTOMER,
  })
  role: ROLES;

  @OneToOne(() => Customer, (customer) => customer.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
