// NestJS modules
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { In, Repository, FindOptionsWhere, Between } from 'typeorm';

// Entities
import { Category, Product } from '../../entities';

// DTOs
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from '../../dtos';

// Services
import { BrandsService, CategoriesService } from '../index';
import { ImagesService } from '../../../cloudinary/services/images/images.service';

// Module imports
import { BaseService } from '../../../common/base.service';

@Injectable()
export class ProductsService extends BaseService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly brandsService: BrandsService,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly categoriesService: CategoriesService,
    private readonly imagesService: ImagesService,
  ) {
    super();
  }

  private async validateCategoriesExist(idsList: number[]) {
    const allCategoryIds = (await this.categoriesService.findAll()).map(
      (category) => category.id,
    );
    const invalidCategoryIds = idsList.filter(
      (categoryId) => !allCategoryIds.includes(categoryId),
    );
    if (invalidCategoryIds.length > 0) {
      const invalidCategoryNames = invalidCategoryIds
        .map((id) => `#${id}`)
        .join(', ');

      const conflictMessage =
        invalidCategoryIds.length > 1
          ? `Categories ${invalidCategoryNames} are not registered in the database`
          : `Category ${invalidCategoryNames} is not registered in the database`;

      throw new ConflictException(conflictMessage);
    }
  }

  async findAll(filterProductsDto?: FilterProductsDto) {
    try {
      if (filterProductsDto) {
        const where: FindOptionsWhere<Product> = {};
        const { limit, offset } = filterProductsDto;
        const { minPrice, maxPrice } = filterProductsDto;
        if (minPrice && maxPrice) {
          where.price = Between(minPrice, maxPrice);
        }

        const productsList = await this.productRepo.find({
          relations: ['brand', 'image'],
          where,
          take: limit,
          skip: offset,
        });
        return productsList;
      }
      const productsList = await this.productRepo.find({
        relations: ['brand', 'image'],
      });
      return productsList;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findOne(productId: number, relations?: string[]) {
    try {
      const product = await this.productRepo.findOne({
        where: { id: productId },
        relations: relations || ['brand', 'image', 'categories'],
      });
      if (!product)
        throw new NotFoundException(`Product #${productId} not Found`);
      return product;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findProductById(productId: number) {
    try {
      const product = await this.productRepo.findOneBy({ id: productId });
      if (!product) throw new NotFoundException();
      return product;
    } catch (error) {
      this.catchError(error);
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepo.create(createProductDto);
      if (createProductDto.brandId) {
        const brand = await this.brandsService.findBrandById(
          createProductDto.brandId,
        );
        newProduct.brand = brand;
      }
      if (createProductDto.imageId) {
        const image = await this.imagesService.findImageById(
          createProductDto.imageId,
        );
        newProduct.image = image;
      }
      if (createProductDto.categoriesIds) {
        await this.validateCategoriesExist(createProductDto.categoriesIds);
        const categories = await this.categoryRepo.findBy({
          id: In(createProductDto.categoriesIds),
        });
        newProduct.categories = categories;
      }
      const createdProduct = this.productRepo.save(newProduct);
      return createdProduct;
    } catch (error) {
      this.catchError(error);
    }
  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    try {
      const productFound = await this.findProductById(productId);
      if (updateProductDto.brandId) {
        const brand = await this.brandsService.findBrandById(
          updateProductDto.brandId,
        );
        productFound.brand = brand;
      }
      if (updateProductDto.categoriesIds) {
        await this.validateCategoriesExist(updateProductDto.categoriesIds);
        const categories = await this.categoryRepo.findBy({
          id: In(updateProductDto.categoriesIds),
        });
        productFound.categories = categories;
      }
      this.productRepo.merge(productFound, updateProductDto);
      const updatedProduct = await this.productRepo.save(productFound);
      return updatedProduct;
    } catch (error) {
      this.catchError(error);
    }
  }

  async addCategoryToProduct(productId: number, categoryId: number) {
    try {
      const product = await this.findOne(productId, ['categories']);
      const category =
        await this.categoriesService.findCategoryById(categoryId);
      const hasCategory = product.categories.find(
        (category) => category.id === categoryId,
      );
      if (hasCategory) {
        throw new ConflictException(
          `Category #${categoryId} already exists within the product`,
        );
      }
      product.categories.push(category);
      const addedCategoryToProduct = this.productRepo.save(product);
      return addedCategoryToProduct;
    } catch (error) {
      this.catchError(error);
    }
  }

  async removeCategoryByProduct(productId: number, categoryId: number) {
    try {
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
      const deletedCategoryToProduct = await this.productRepo.save(product);
      return deletedCategoryToProduct;
    } catch (error) {
      this.catchError(error);
    }
  }

  async delete(productId: number) {
    try {
      const deletedProduct = await this.findProductById(productId);
      await this.productRepo.delete(productId);
      return deletedProduct;
    } catch (error) {
      this.catchError(error);
    }
  }
}
