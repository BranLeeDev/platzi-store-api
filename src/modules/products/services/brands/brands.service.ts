// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Entity imports
import { Brand } from '../../entities/brand.entity';

// DTO imports
import { CreateBrandDto } from '../../dtos/brands/create-brand.dto';
import { UpdateBrandDto } from '../../dtos/brands/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private readonly brandsRepo: Repository<Brand>,
  ) {}

  findAll() {
    return this.brandsRepo.find();
  }

  async findOne(id: number) {
    const brand = await this.brandsRepo.findOneBy({ id });
    if (!brand) throw new NotFoundException(`Brand #${id} not Found`);
    return brand;
  }

  async create(payload: CreateBrandDto) {
    const newBrand = this.brandsRepo.create(payload);
    await this.brandsRepo.save(newBrand);

    return {
      message: 'Brand created successfully',
      data: newBrand,
    };
  }

  async update(id: number, payload: UpdateBrandDto) {
    const brandFound = await this.findOne(id);
    this.brandsRepo.merge(brandFound, payload);
    const updatedResult = await this.brandsRepo.save(brandFound);

    return {
      message: 'Brand updated successfully',
      data: updatedResult,
    };
  }

  async delete(id: number) {
    const deletedResult = await this.findOne(id);
    await this.brandsRepo.delete(id);

    return {
      message: 'Brand deleted successfully',
      data: deletedResult,
    };
  }
}
