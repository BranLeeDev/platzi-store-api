// Third-party libraries
import { Column, Entity, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';

// Entities
import { Base } from '../../common/base.entity';
import { Brand } from '../../products/entities/brand.entity';
import { Category, Product } from '../../products/entities';

// Types imports
import { IMAGES_TYPES } from '../types/enums';

@Entity({ name: 'images' })
export class Image extends Base {
  @Column({ type: 'int', name: 'width_pixels' })
  width: number;

  @Column({ type: 'int', name: 'height_pixels' })
  height: number;

  @Column({ type: 'text', name: 'image_url' })
  image: string;

  @Exclude()
  @Column({ type: 'int', name: 'bytes_size' })
  bytesSize: number;

  @Exclude()
  @Column({ type: 'enum', enum: IMAGES_TYPES, name: 'image_type' })
  imageType: IMAGES_TYPES;

  @Exclude()
  @Column({ type: 'varchar', length: 255, name: 'public_id' })
  publicId: string;

  @OneToOne(() => Brand, (brand) => brand.image)
  brand: Brand;

  @OneToOne(() => Category, (category) => category.image)
  category: Category;

  @OneToOne(() => Product, (product) => product.image)
  product: Product;
}
