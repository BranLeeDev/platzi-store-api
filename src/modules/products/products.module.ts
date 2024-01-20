// NestJS modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controller imports
import { BrandsController } from './controllers/brands/brands.controller';
import { CategoriesController } from './controllers/categories/categories.controller';
import { ProductsController } from './controllers/products/products.controller';

// Service imports
import { BrandsService } from './services/brands/brands.service';
import { CategoriesService } from './services/categories/categories.service';
import { ProductsService } from './services/products/products.service';

// Entity imports
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Category])],
  controllers: [BrandsController, CategoriesController, ProductsController],
  providers: [BrandsService, CategoriesService, ProductsService],
})
export class ProductsModule {}
