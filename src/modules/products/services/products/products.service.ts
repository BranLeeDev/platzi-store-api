// NestJS modules
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { In, Repository } from 'typeorm';

// Entities
import { Category, Product } from '../../entities';

// DTOs
import { CreateProductDto, UpdateProductDto } from '../../dtos';

// Services
import { BrandsService, CategoriesService } from '../index';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly brandsService: BrandsService,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll() {
    const productsList = await this.productRepo.find({
      relations: ['brand'],
    });
    return productsList;
  }

  async findOne(productId: number, relations?: string[]) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: relations || ['brand', 'categories'],
    });
    if (!product)
      throw new NotFoundException(`Product #${productId} not Found`);
    return product;
  }

  async findProductById(productId: number) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new NotFoundException();
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepo.create(createProductDto);
    if (createProductDto.brandId) {
      const brand = await this.brandsService.findBrandById(
        createProductDto.brandId,
      );
      newProduct.brand = brand;
    }
    if (createProductDto.categoriesIds) {
      const categories = await this.categoryRepo.findBy({
        id: In(createProductDto.categoriesIds),
      });
      newProduct.categories = categories;
    }
    const createdProduct = this.productRepo.save(newProduct);
    return createdProduct;
  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    const productFound = await this.findProductById(productId);
    if (updateProductDto.brandId) {
      const brand = await this.brandsService.findBrandById(
        updateProductDto.brandId,
      );
      productFound.brand = brand;
    }
    if (updateProductDto.categoriesIds) {
      const categories = await this.categoryRepo.findBy({
        id: In(updateProductDto.categoriesIds),
      });
      productFound.categories = categories;
    }
    this.productRepo.merge(productFound, updateProductDto);
    const updatedResult = await this.productRepo.save(productFound);
    return updatedResult;
  }

  async addCategoryToProduct(productId: number, categoryId: number) {
    const product = await this.findOne(productId, ['categories']);
    await this.categoriesService.findCategoryById(categoryId);
    const hasCategory = product.categories.find(
      (category) => category.id === categoryId,
    );
    if (hasCategory) {
      throw new ConflictException(
        `Category #${categoryId} already exists within the product`,
      );
    }
    const category = await this.categoryRepo.findOneBy({ id: categoryId });
    product.categories.push(category);
    const addedCategory = this.productRepo.save(product);
    return addedCategory;
  }

  async removeCategoryByProduct(productId: number, categoryId: number) {
    const product = await this.findOne(productId, ['categories']);
    await this.categoriesService.findCategoryById(categoryId);
    const hasCategory = product.categories.find(
      (category) => category.id === categoryId,
    );
    if (!hasCategory)
      throw new ConflictException(
        `Category #${categoryId} not found within the product`,
      );
    product.categories = product.categories.filter(
      (item) => item.id !== categoryId,
    );
    const deletedCategory = await this.productRepo.save(product);
    return deletedCategory;
  }

  async delete(productId: number) {
    const deletedProduct = await this.findProductById(productId);
    await this.productRepo.delete(productId);
    return deletedProduct;
  }
}
