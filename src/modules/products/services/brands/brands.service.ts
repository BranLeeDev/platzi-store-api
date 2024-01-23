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
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
  ) {}

  findAll() {
    return this.brandRepo.find();
  }

  async findOne(id: number) {
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!brand) throw new NotFoundException(`Brand #${id} not Found`);
    return brand;
  }

  async create(payload: CreateBrandDto) {
    const newBrand = this.brandRepo.create(payload);
    await this.brandRepo.save(newBrand);

    return {
      message: 'Brand created successfully',
      data: newBrand,
    };
  }

  async update(id: number, payload: UpdateBrandDto) {
    const brandFound = await this.findOne(id);
    this.brandRepo.merge(brandFound, payload);
    const updatedResult = await this.brandRepo.save(brandFound);

    return {
      message: 'Brand updated successfully',
      data: updatedResult,
    };
  }

  async delete(id: number) {
    const deletedResult = await this.findOne(id);
    await this.brandRepo.delete(id);

    return {
      message: 'Brand deleted successfully',
      data: deletedResult,
    };
  }
}
