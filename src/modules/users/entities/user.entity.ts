import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ROLES } from '../types/enums';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
