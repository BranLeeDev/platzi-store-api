// NestJS modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controller imports
import { BrandsController } from './controllers/brands/brands.controller';
import { CategoriesController } from './controllers/categories/categories.controller';

// Service imports
import { BrandsService } from './services/brands/brands.service';
import { CategoriesService } from './services/categories/categories.service';

// Entity imports
import { Brand } from './entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController, CategoriesController],
  providers: [BrandsService, CategoriesService],
})
export class ProductsModule {}
