// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Entity imports
import { Category } from '../../entities/category.entity';

// DTO imports
import { UpdateCategoryDto } from '../../dtos/categories/update-category.dto';
import { CreateCategoryDto } from '../../dtos/categories/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepo.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException(`Category #${id} not Found`);
    return category;
  }

  async create(payload: CreateCategoryDto) {
    const newCategory = this.categoryRepo.create(payload);
    await this.categoryRepo.save(newCategory);

    return {
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  async update(id: number, payload: UpdateCategoryDto) {
    const categoryFound = await this.findOne(id);
    this.categoryRepo.merge(categoryFound, payload);
    const updatedResult = await this.categoryRepo.save(categoryFound);

    return {
      message: 'Category updated successfully',
      data: updatedResult,
    };
  }

  async delete(id: number) {
    const deletedResult = await this.findOne(id);
    await this.categoryRepo.delete(id);

    return {
      message: 'Category deleted successfully',
      data: deletedResult,
    };
  }
}
