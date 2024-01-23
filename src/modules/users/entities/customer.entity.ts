import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GENDERS } from '../types/enums';
import { User } from './user.entity';

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

  @OneToOne(() => User, (user) => user.customer, { nullable: true })
  user: User;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
