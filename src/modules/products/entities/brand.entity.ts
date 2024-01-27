// Third-party libraries
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

// Entity imports
import { Base } from '../../common/base.entity';
import { Image } from '../../cloudinary/entities/image.entity';
import { Product } from './index';

@Entity({ name: 'brands' })
export class Brand extends Base {
  @Column({ type: 'varchar', length: 30, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  @OneToOne(() => Image, (image) => image.brand)
  @JoinColumn({ name: 'image_id' })
  image: Image;
}
