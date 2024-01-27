// NestJS modules
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

// Types
import { CloudinaryResponse } from '../../types/types';
import { IMAGES_TYPES } from '../../types/enums';

// Entities
import { Image } from '../../entities/image.entity';

// DTOs
import { CreateImageDto } from '../../dtos';

// Services
import { BaseService } from '../../../common/base.service';

@Injectable()
export class ImagesService extends BaseService {
  constructor(
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
  ) {
    super();
  }

  uploadImage(imageFile: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'platzi-store-api/images' },
        async (error, result) => {
          if (error) return reject(error);

          if (result.width >= 1200 || result.height >= 1200) {
            reject(
              new BadRequestException(
                'Image dimensions must be 1200x1200 pixels or smaller',
              ),
            );
          }

          const createImageDto: CreateImageDto = {
            width: result.width,
            height: result.height,
            image: result.secure_url,
            imageType: result.format as IMAGES_TYPES,
            bytesSize: result.bytes,
            publicId: result.public_id,
          };
          const newImage = await this.createImage(createImageDto);

          resolve({ ...result, imageId: newImage.id });
        },
      );

      streamifier.createReadStream(imageFile.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(imageId: number): Promise<CloudinaryResponse> {
    try {
      const deletedImage = await this.delete(imageId);
      return new Promise<CloudinaryResponse>((resolve, reject) => {
        cloudinary.uploader.destroy(deletedImage.publicId, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      this.catchError(error);
    }
  }

  private async createImage(createImageDto: CreateImageDto) {
    try {
      const newImage = this.imageRepo.create(createImageDto);
      const createdImage = await this.imageRepo.save(newImage);
      return createdImage;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findAll() {
    try {
      const imagesList = await this.imageRepo.find();
      return imagesList;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findImageById(imageId: number) {
    try {
      const image = await this.imageRepo.findOneBy({ id: imageId });
      if (!image) throw new NotFoundException(`Image #${imageId} not Found`);
      return image;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findOne(imageId: number) {
    try {
      const image = await this.imageRepo.findOne({ where: { id: imageId } });
      if (!image) throw new NotFoundException(`Image #${imageId} not Found`);
      return image;
    } catch (error) {
      this.catchError(error);
    }
  }

  private async delete(imageId: number) {
    try {
      const deletedImage = await this.findImageById(imageId);
      await this.imageRepo.delete(imageId);
      return deletedImage;
    } catch (error) {
      this.catchError(error);
    }
  }
}
