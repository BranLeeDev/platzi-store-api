// Third-party libraries
import { Column, Entity, ManyToMany } from 'typeorm';

// Entity imports
import { Base } from '../../common/base.entity';
import { Product } from './index';

@Entity({ name: 'categories' })
export class Category extends Base {
  @Column({ type: 'varchar', length: '30', unique: true })
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
