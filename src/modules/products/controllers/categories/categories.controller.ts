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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Service imports
import { CategoriesService } from '../../services/categories/categories.service';

// Dto imports
import { CreateCategoryDto } from '../../dtos/categories/create-category.dto';
import { UpdateCategoryDto } from '../../dtos/categories/update-category.dto';

// Entity imports
import { Category } from '../../entities/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieve a list of all categories',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all categories',
    type: [Category],
  })
  getAllCategories() {
    return this.categoriesService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a category',
    description: 'Create a new category',
  })
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
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieve details of a specific category by ID',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Category details', type: Category })
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update category by ID',
    description: 'Update details of a specific category by ID',
  })
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
  @ApiOperation({
    summary: 'Delete category by ID',
    description: 'Delete a specific category by ID',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.delete(id);
  }
}
