// NestJS modules
import { Module } from '@nestjs/common';

// Controller imports
import { BrandsController } from './controllers/brands/brands.controller';

// Service imports
import { BrandsService } from './services/brands/brands.service';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class ProductsModule {}
