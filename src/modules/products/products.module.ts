// NestJS modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Brand, Category, Product } from './entities';

// Services
import { BrandsService, CategoriesService, ProductsService } from './services';

// Controllers
import {
  BrandsController,
  CategoriesController,
  ProductsController,
} from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Category, Product])],
  controllers: [BrandsController, CategoriesController, ProductsController],
  providers: [BrandsService, CategoriesService, ProductsService],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
