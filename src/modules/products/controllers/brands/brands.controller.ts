// NestJS modules
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

// Service imports
import { BrandsService } from '../../services/brands/brands.service';

// Dto imports
import { UpdateBrandDto } from '../../dtos/brands/update-brand.dto';
import { CreateBrandDto } from '../../dtos/brands/create-brand.dto';

// Entities imports
import { Brand } from '../../entities/brand.entity';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all brands',
    type: [Brand],
  })
  getAllBrands() {
    return this.brandsService.findAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Brand created successfully',
    type: Brand,
  })
  @ApiBody({ type: CreateBrandDto })
  createBrand(@Body() payload: CreateBrandDto) {
    return this.brandsService.create(payload);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Brand details', type: Brand })
  getBrand(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Brand updated successfully',
    type: Brand,
  })
  @ApiBody({ type: UpdateBrandDto })
  updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, payload);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.delete(id);
  }
}
