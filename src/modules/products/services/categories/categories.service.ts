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
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  findAll() {
    return this.categoriesRepo.find();
  }

  findOne(id: number) {
    const category = this.categoriesRepo.findOneBy({ id });
    if (!category) throw new NotFoundException(`Category #${id} not Found`);
    return category;
  }

  async create(payload: CreateCategoryDto) {
    const newCategory = this.categoriesRepo.create(payload);
    await this.categoriesRepo.save(newCategory);

    return {
      message: 'Category created successfully',
      data: newCategory,
    };
  }

  async update(id: number, payload: UpdateCategoryDto) {
    const category = await this.findOne(id);
    this.categoriesRepo.merge(category, payload);
    const updateResult = await this.categoriesRepo.save(category);

    return {
      message: 'Category updated successfully',
      data: updateResult,
    };
  }

  async delete(id: number) {
    const deleteResult = await this.findOne(id);
    await this.categoriesRepo.delete(id);

    return {
      message: 'Category deleted successfully',
      data: deleteResult,
    };
  }
}
