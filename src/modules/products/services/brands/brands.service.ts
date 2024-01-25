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

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo: Repository<Brand>,
  ) {}

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
    const brandsList = await this.brandRepo.find();
    return brandsList;
  }

  async findOne(brandId: number) {
    const brand = await this.brandRepo.findOne({
      where: { id: brandId },
      relations: ['products'],
    });
    if (!brand) throw new NotFoundException(`Brand #${brandId} not Found`);
    return brand;
  }

  async findBrandById(brandId: number) {
    const brand = await this.brandRepo.findOneBy({ id: brandId });
    if (!brand) throw new NotFoundException(`Brand #${brandId} not Found`);
    return brand;
  }

  async create(createBrandDto: CreateBrandDto) {
    await this.verifyBrandNameUniqueness(createBrandDto.name);
    const newBrand = this.brandRepo.create(createBrandDto);
    const createdResult = await this.brandRepo.save(newBrand);
    return createdResult;
  }

  async update(brandId: number, updateBrandDto: UpdateBrandDto) {
    const brandFound = await this.findBrandById(brandId);
    if (updateBrandDto.name) {
      await this.verifyBrandNameUniqueness(updateBrandDto.name);
    }
    this.brandRepo.merge(brandFound, updateBrandDto);
    const updatedResult = await this.brandRepo.save(brandFound);
    return updatedResult;
  }

  async delete(brandId: number) {
    const deletedResult = await this.findBrandById(brandId);
    await this.brandRepo.delete(brandId);
    return deletedResult;
  }
}
