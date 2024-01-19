// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// Entity imports
import { Brand } from '../../entities/brand.entity';

// Dto imports
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

  findOne(id: number) {
    const brand = this.brandsRepo.findOneBy({ id });
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
    const brand = await this.findOne(id);
    this.brandsRepo.merge(brand, payload);
    const updateResult = await this.brandsRepo.save(brand);

    return {
      message: 'Brand updated successfully',
      data: updateResult,
    };
  }

  async delete(id: number) {
    const deleteResult = await this.findOne(id);
    await this.brandsRepo.delete(id);

    return {
      message: 'Brand deleted successfully',
      data: deleteResult,
    };
  }
}
