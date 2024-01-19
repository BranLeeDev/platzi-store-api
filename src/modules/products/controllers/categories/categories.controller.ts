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

// Service imports
import { CategoriesService } from '../../services/categories/categories.service';

// Dto imports
import { CreateCategoryDto } from '../../dtos/categories/create-category.dto';
import { UpdateCategoryDto } from '../../dtos/categories/update-category.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

// Entity imports
import { Category } from '../../entities/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all categories',
    type: [Category],
  })
  getAllCategories() {
    return this.categoriesService.findAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: Category,
  })
  @ApiBody({ type: CreateCategoryDto })
  createCategory(@Body() payload: CreateCategoryDto) {
    return this.categoriesService.create(payload);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Category details', type: Category })
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiBody({ type: UpdateCategoryDto })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, payload);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.delete(id);
  }
}
