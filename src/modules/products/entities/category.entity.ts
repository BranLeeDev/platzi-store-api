// Third-party libraries
import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';

// Entity imports
import { Base } from '../../common/base.entity';
import { Product } from './index';
import { Image } from '../../cloudinary/entities/image.entity';

@Entity({ name: 'categories' })
export class Category extends Base {
  @Column({ type: 'varchar', length: '30', unique: true })
  name: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @OneToOne(() => Image, (image) => image.category)
  @JoinColumn({ name: 'image_id' })
  image: Image;
}
