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
import { ProductsService } from '../../services/products/products.service';

// DTO imports
import { CreateProductDto } from '../../dtos/products/create-product.dto';
import { UpdateProductDto } from '../../dtos/products/update-product.dto';

// Entity imports
import { Product } from '../../entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  getAllProducts() {
    return this.productsService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a product',
    description: 'Create a new product',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiBody({ type: CreateProductDto })
  createProduct(@Body() payload: CreateProductDto) {
    return this.productsService.create(payload);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve details of a specific product by ID',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Product details', type: Product })
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update product by ID',
    description: 'Update details of a specific product by ID',
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiBody({ type: UpdateProductDto })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductDto,
  ) {
    return this.productsService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete product by ID',
    description: 'Delete a specific product by ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'ID of the product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
