// NestJS modules
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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

// DTOs
import { CreateProductDto, UpdateProductDto } from '../../dtos';

// Entities
import { Product } from '../../entities';

// Services
import { ProductsService } from '../../services';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  private validateEmptyBody(body: any) {
    if (Object.keys(body).length > 0) {
      throw new HttpException(
        'This endpoint does not accept content',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve a list of all products',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: [Product],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getAllProducts(@Body() body: any) {
    this.validateEmptyBody(body);
    const res = await this.productsService.findAll();
    return res;
  }

  @Post()
  @ApiOperation({
    summary: 'Create a product',
    description: 'Create a new product',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - The product data is invalid or the name does not meet the requirements',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const res = await this.productsService.create(createProductDto);
    return {
      message: 'Product created successfully',
      data: res,
    };
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve details of a specific product by ID',
  })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({ status: 200, description: 'Product details', type: Product })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: any,
  ) {
    this.validateEmptyBody(body);
    const res = await this.productsService.findOne(productId);
    return res;
  }

  @Patch(':productId')
  @ApiOperation({
    summary: 'Update product by ID',
    description: 'Update details of a specific product by ID',
  })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - The update data is invalid or incomplete',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found - The specified product ID does not exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() payload: UpdateProductDto,
  ) {
    const res = await this.productsService.update(productId, payload);
    return {
      message: 'Product updated successfully',
      data: res,
    };
  }

  @ApiOperation({
    summary: 'Add a category to a product',
    description: 'Endpoint to associate a category with a specific product',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product to update',
    type: 'integer',
    example: 1,
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID of the category to add to the product',
    type: 'integer',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Category successfully added to the product',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 404,
    description: 'Product or category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Bad request - Category already exists within the product.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Patch(':productId/category/:categoryId')
  async addCategoryToProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() body: any,
  ) {
    this.validateEmptyBody(body);
    const res = await this.productsService.addCategoryToProduct(
      productId,
      categoryId,
    );
    return {
      message: 'Category successfully added to the product',
      data: res,
    };
  }

  @Delete(':productId')
  @ApiOperation({
    summary: 'Delete product by ID',
    description: 'Delete a specific product by ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async deleteProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: any,
  ) {
    this.validateEmptyBody(body);
    const res = await this.productsService.delete(productId);
    return {
      message: 'Product deleted successfully',
      data: res,
    };
  }

  @Delete(':productId/category/:categoryId')
  @ApiOperation({
    summary: 'Delete a category from a product',
    description:
      'Endpoint to remove a category association from a specific product',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product to update',
    type: 'integer',
    example: 1,
  })
  @ApiParam({
    name: 'categoryId',
    description: 'ID of the category to remove from the product',
    type: 'integer',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Category removed successfully from the product',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 404,
    description: 'Product or category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Category not found within the product',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async removeCategoryByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() body: any,
  ) {
    this.validateEmptyBody(body);
    const res = await this.productsService.removeCategoryByProduct(
      productId,
      categoryId,
    );
    return {
      message: 'Category removed successfully from the product',
      data: res,
    };
  }
}
