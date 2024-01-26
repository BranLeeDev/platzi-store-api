import { Module } from '@nestjs/common';
import { ImagesService } from './services/images/images.service';
import { ImagesController } from './controllers/images/images.controller';
import registers from 'src/configs/registers';
import { ConfigType } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Module({
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
