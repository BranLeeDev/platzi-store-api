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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Entities
import { Category } from '../../entities';

// DTOs
import { CreateCategoryDto, UpdateCategoryDto } from '../../dtos';

// Services
import { CategoriesService } from '../../services';

// Module imports
import { BaseController } from '../../../common/base.controller';

// TypeImports
import { ROLES } from '../../../users/types/enums';

// Auth imports
import { RolesGuard } from '../../../auth/guards/roles/roles.guard';
import { Public } from '../../../auth/decorators/public.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('categories')
@Controller('categories')
export class CategoriesController extends BaseController {
  constructor(private readonly categoriesService: CategoriesService) {
    super();
  }

  @Public()
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
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getAllCategories(@Body() body: any) {
    try {
      this.validateEmptyBody(body);
      const res = await this.categoriesService.findAll();
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Roles(ROLES.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a category',
    description: 'Create a new category',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: Category,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - The category data is invalid or the name does not meet the requirements',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - The category name must be unique',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async createCategory(@Body() payload: CreateCategoryDto) {
    try {
      const res = await this.categoriesService.create(payload);
      return {
        message: 'Category created successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Public()
  @Get(':categoryId')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieve details of a specific category by ID',
  })
  @ApiParam({
    name: 'categoryId',
    type: 'number',
    description: 'ID of the category',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Category details', type: Category })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.categoriesService.findOne(categoryId);
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Roles(ROLES.ADMIN)
  @Patch(':categoryId')
  @ApiOperation({
    summary: 'Update category by ID',
    description: 'Update details of a specific category by ID',
  })
  @ApiParam({
    name: 'categoryId',
    type: 'number',
    description: 'ID of the category to update',
    example: 1,
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - The update data is invalid or incomplete',
  })
  @ApiResponse({
    status: 404,
    description:
      'Category not found - The specified category ID does not exist',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Unable to update category due to data conflict',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const res = await this.categoriesService.update(
        categoryId,
        updateCategoryDto,
      );
      return {
        message: 'Category updated successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Roles(ROLES.ADMIN)
  @Delete(':categoryId')
  @ApiOperation({
    summary: 'Delete category by ID',
    description: 'Delete a specific category by ID',
  })
  @ApiParam({
    name: 'categoryId',
    type: 'number',
    description: 'ID of the category to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async deleteCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.categoriesService.delete(categoryId);
      return {
        message: 'Category deleted successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }
}
