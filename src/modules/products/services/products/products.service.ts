// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// DTO imports
import { CreateProductDto } from '../../dtos/products/create-product.dto';
import { UpdateProductDto } from '../../dtos/products/update-product.dto';

// Entity imports
import { Product } from '../../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productsRepo.find();
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOneBy({ id });
    if (!product) throw new NotFoundException(`Product #${id} not Found`);
    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = this.productsRepo.create(payload);
    await this.productsRepo.save(newProduct);

    return {
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  async update(id: number, payload: UpdateProductDto) {
    const productFound = await this.findOne(id);
    this.productsRepo.merge(productFound, payload);
    const updatedResult = await this.productsRepo.save(productFound);

    return {
      message: 'Product updated successfully',
      data: updatedResult,
    };
  }

  async delete(id: number) {
    const deletedProduct = await this.findOne(id);
    await this.productsRepo.delete(deletedProduct);

    return {
      message: 'Product deleted successfully',
      data: deletedProduct,
    };
  }
}
