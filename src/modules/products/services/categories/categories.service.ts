// NestJS modules
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Entities
import { Category } from '../../entities';

// DTOs
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos';

// Module imports
import { BaseService } from '../../../common/base.service';

@Injectable()
export class CategoriesService extends BaseService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {
    super();
  }

  private async verifyCategoryNameUniqueness(name: string) {
    const isThereCategory = await this.categoryRepo.findOne({
      where: { name },
    });
    if (isThereCategory)
      throw new HttpException(
        'A category with the same name already exists. Please choose a different name',
        HttpStatus.CONFLICT,
      );
  }

  async findAll() {
    try {
      const categoriesList = await this.categoryRepo.find();
      return categoriesList;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findCategoryById(categoryId: number) {
    try {
      const category = await this.categoryRepo.findOneBy({ id: categoryId });
      if (!category)
        throw new NotFoundException(`Category #${categoryId} not Found`);
      return category;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findOne(categoryId: number) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id: categoryId },
        relations: ['products'],
      });
      if (!category)
        throw new NotFoundException(`Category #${categoryId} not Found`);
      return category;
    } catch (error) {
      this.catchError(error);
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      await this.verifyCategoryNameUniqueness(createCategoryDto.name);
      const newCategory = this.categoryRepo.create(createCategoryDto);
      const createdCategory = await this.categoryRepo.save(newCategory);
      return createdCategory;
    } catch (error) {
      this.catchError(error);
    }
  }

  async update(categoryId: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const categoryFound = await this.findCategoryById(categoryId);
      if (updateCategoryDto.name) {
        await this.verifyCategoryNameUniqueness(updateCategoryDto.name);
      }
      this.categoryRepo.merge(categoryFound, updateCategoryDto);
      const updatedCategory = await this.categoryRepo.save(categoryFound);
      return updatedCategory;
    } catch (error) {
      this.catchError(error);
    }
  }

  async delete(categoryId: number) {
    try {
      const deletedCategory = await this.findCategoryById(categoryId);
      await this.categoryRepo.delete(categoryId);
      return deletedCategory;
    } catch (error) {
      this.catchError(error);
    }
  }
}
