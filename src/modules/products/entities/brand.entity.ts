// Third-party libraries
import { Column, Entity, OneToMany } from 'typeorm';

// Entity imports
import { Base, Product } from './index';

@Entity({ name: 'brands' })
export class Brand extends Base {
  @Column({ type: 'varchar', length: 30, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
