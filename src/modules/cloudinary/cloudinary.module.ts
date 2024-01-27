// NestJS modules
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Third-party libraries
import { v2 as cloudinary } from 'cloudinary';

// Entities
import { Image } from './entities/image.entity';

// Services
import { ImagesService } from './services/images/images.service';

// Controllers
import { ImagesController } from './controllers/images/images.controller';

// Config imports
import registers from 'src/configs/registers';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    {
      provide: 'CLOUDINARY',
      inject: [registers.KEY],
      useFactory: (registersService: ConfigType<typeof registers>) => {
        const { cloudName, apiKey, apiSecret } = registersService.cloudinary;
        return cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });
      },
    },
  ],
})
export class CloudinaryModule {}
