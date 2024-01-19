// NestJS modules
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controller imports
import { BrandsController } from './controllers/brands/brands.controller';

// Service imports
import { BrandsService } from './services/brands/brands.service';

// Entity imports
import { Brand } from './entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class ProductsModule {}
