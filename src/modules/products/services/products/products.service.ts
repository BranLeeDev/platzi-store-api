// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Service imports
import { BrandsService } from '../brands/brands.service';

// DTO imports
import { CreateProductDto } from '../../dtos/products/create-product.dto';
import { UpdateProductDto } from '../../dtos/products/update-product.dto';

// Entity imports
import { Product } from '../../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly brandsService: BrandsService,
  ) {}

  findAll() {
    return this.productRepo.find({
      relations: ['brand'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['brand'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not Found`);
    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = this.productRepo.create(payload);

    if (payload.brandId) {
      const brand = await this.brandsService.findOne(payload.brandId);
      newProduct.brand = brand;
    }

    await this.productRepo.save(newProduct);

    return {
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  async update(id: number, payload: UpdateProductDto) {
    const productFound = await this.findOne(id);

    if (payload.brandId) {
      const brand = await this.brandsService.findOne(payload.brandId);
      productFound.brand = brand;
    }

    this.productRepo.merge(productFound, payload);
    const updatedResult = await this.productRepo.save(productFound);

    return {
      message: 'Product updated successfully',
      data: updatedResult,
    };
  }

  async delete(id: number) {
    const deletedProduct = await this.findOne(id);
    await this.productRepo.delete(id);

    return {
      message: 'Product deleted successfully',
      data: deletedProduct,
    };
  }
}
