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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

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
    const brandsList = await this.categoryRepo.find();
    return brandsList;
  }

  async findCategoryById(categoryId: number) {
    const category = await this.categoryRepo.findOneBy({ id: categoryId });
    if (!category)
      throw new NotFoundException(`Category #${categoryId} not Found`);
    return category;
  }

  async findOne(categoryId: number) {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });
    if (!category)
      throw new NotFoundException(`Category #${categoryId} not Found`);
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    await this.verifyCategoryNameUniqueness(createCategoryDto.name);
    const newCategory = this.categoryRepo.create(createCategoryDto);
    const createdResult = await this.categoryRepo.save(newCategory);
    return createdResult;
  }

  async update(categoryId: number, updateCategoryDto: UpdateCategoryDto) {
    const categoryFound = await this.findCategoryById(categoryId);
    if (updateCategoryDto.name) {
      await this.verifyCategoryNameUniqueness(updateCategoryDto.name);
    }
    this.categoryRepo.merge(categoryFound, updateCategoryDto);
    const updatedResult = await this.categoryRepo.save(categoryFound);
    return updatedResult;
  }

  async delete(categoryId: number) {
    const deletedResult = await this.findCategoryById(categoryId);
    await this.categoryRepo.delete(categoryId);
    return deletedResult;
  }
}
