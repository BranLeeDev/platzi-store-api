// Third-party libraries
import { Column, Entity, ManyToMany } from 'typeorm';

// Entity imports
import { Base, Product } from './index';

@Entity({ name: 'categories' })
export class Category extends Base {
  @Column({ type: 'varchar', length: '30', unique: true })
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
