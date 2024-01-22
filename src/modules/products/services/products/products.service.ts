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
    private readonly productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.productRepo.find();
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException(`Product #${id} not Found`);
    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = this.productRepo.create(payload);
    await this.productRepo.save(newProduct);

    return {
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  async update(id: number, payload: UpdateProductDto) {
    const productFound = await this.findOne(id);
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
