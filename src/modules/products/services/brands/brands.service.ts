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
import { Brand } from '../../entities';

// DTOs
import { CreateBrandDto, UpdateBrandDto } from '../../dtos';

// Module imports
import { BaseService } from '../../../common/base.service';

@Injectable()
export class BrandsService extends BaseService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
  ) {
    super();
  }

  private async verifyBrandNameUniqueness(name: string) {
    const isThereBrand = await this.brandRepo.findOne({
      where: { name },
    });
    if (isThereBrand)
      throw new HttpException(
        'A brand with the same name already exists. Please choose a different name',
        HttpStatus.CONFLICT,
      );
  }

  async findAll() {
    try {
      const brandsList = await this.brandRepo.find();
      return brandsList;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findOne(brandId: number) {
    try {
      const brand = await this.brandRepo.findOne({
        where: { id: brandId },
        relations: ['products'],
      });
      if (!brand) {
        throw new NotFoundException(`Brand #${brandId} not Found`);
      }
      return brand;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findBrandById(brandId: number) {
    try {
      const brand = await this.brandRepo.findOneBy({ id: brandId });
      if (!brand) {
        throw new NotFoundException(`Brand #${brandId} not Found`);
      }
      return brand;
    } catch (error) {
      this.catchError(error);
    }
  }

  async create(createBrandDto: CreateBrandDto) {
    try {
      await this.verifyBrandNameUniqueness(createBrandDto.name);
      const newBrand = this.brandRepo.create(createBrandDto);
      const createdBrand = await this.brandRepo.save(newBrand);
      return createdBrand;
    } catch (error) {
      this.catchError(error);
    }
  }

  async update(brandId: number, updateBrandDto: UpdateBrandDto) {
    try {
      const brandFound = await this.findBrandById(brandId);
      if (updateBrandDto.name) {
        await this.verifyBrandNameUniqueness(updateBrandDto.name);
      }
      this.brandRepo.merge(brandFound, updateBrandDto);
      const updatedBrand = await this.brandRepo.save(brandFound);
      return updatedBrand;
    } catch (error) {
      this.catchError(error);
    }
  }

  async delete(brandId: number) {
    try {
      const deletedBrand = await this.findBrandById(brandId);
      await this.brandRepo.delete(brandId);
      return deletedBrand;
    } catch (error) {
      this.catchError(error);
    }
  }
}
