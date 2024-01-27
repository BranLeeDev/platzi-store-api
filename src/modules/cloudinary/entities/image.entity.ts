// Third-party libraries
import { Column, Entity } from 'typeorm';

// Entities
import { Base } from '../../common/base.entity';

// Types imports
import { IMAGES_TYPES } from '../types/enums';

@Entity({ name: 'images' })
export class Image extends Base {
  @Column({ type: 'int', name: 'width_pixels' })
  widthPixels: number;

  @Column({ type: 'int', name: 'height_pixels' })
  heightPixels: number;

  @Column({ type: 'text', name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'int', name: 'bytes_size' })
  bytesSize: number;

  @Column({ type: 'enum', enum: IMAGES_TYPES, name: 'image_type' })
  imageType: IMAGES_TYPES;

  @Column({ type: 'varchar', length: 255, name: 'public_id' })
  publicId: string;
}
