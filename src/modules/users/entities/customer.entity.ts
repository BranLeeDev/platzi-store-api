// Third-party libraries
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Entity imports
import { User } from './user.entity';
import { Order } from './order.entity';

// Type imports
import { GENDERS } from '../types/enums';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.customer, { nullable: true })
  user: User;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
