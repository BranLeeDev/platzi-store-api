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
import { Brand } from '../../entities';

// DTOs
import { CreateBrandDto, UpdateBrandDto } from '../../dtos';

// Services
import { BrandsService } from '../../services';

// Module imports
import { BaseController } from '../../../common/base.controller';

// Types imports
import { ROLES } from '../../../users/types/enums';

// Auth imports
import { RolesGuard } from '../../../auth/guards/roles/roles.guard';
import { Public } from '../../../auth/decorators/public.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('brands')
@Controller('brands')
export class BrandsController extends BaseController {
  constructor(private readonly brandsService: BrandsService) {
    super();
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all brands',
    description: 'Retrieve a list of all brands',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all brands',
    type: [Brand],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getAllBrands(@Body() body: any) {
    try {
      this.validateEmptyBody(body);
      const res = await this.brandsService.findAll();
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Roles(ROLES.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a brand',
    description: 'Create a new brand',
  })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({
    status: 201,
    description: 'Brand created successfully',
    type: Brand,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - The brand data is invalid or the name does not meet the requirements',
  })
  @ApiResponse({
    status: 409,
    description: 'The brand name must be unique',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    try {
      const res = await this.brandsService.create(createBrandDto);
      return {
        message: 'Brand created successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Public()
  @Get(':brandId')
  @ApiOperation({
    summary: 'Get brand by ID',
    description: 'Retrieve details of a specific brand by ID',
  })
  @ApiParam({
    name: 'brandId',
    type: 'number',
    description: 'ID of the brand',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Brand details', type: Brand })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getBrand(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.brandsService.findOne(brandId);
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Roles(ROLES.ADMIN)
  @Patch(':brandId')
  @ApiOperation({
    summary: 'Update brand by ID',
    description: 'Update details of a specific brand by ID',
  })
  @ApiParam({
    name: 'brandId',
    type: 'number',
    description: 'ID of the brand to update',
    example: 1,
  })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({
    status: 200,
    description: 'Brand updated successfully',
    type: Brand,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - The update data is invalid or incomplete',
  })
  @ApiResponse({
    status: 404,
    description: 'Brand not found - The specified brand ID does not exist',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Unable to update brand due to data conflict',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async updateBrand(
    @Param('brandId', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    try {
      const res = await this.brandsService.update(id, updateBrandDto);
      return {
        message: 'Brand updated successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Roles(ROLES.ADMIN)
  @Delete(':brandId')
  @ApiOperation({
    summary: 'Delete brand by ID',
    description: 'Delete a specif brand by ID',
  })
  @ApiParam({
    name: 'brandId',
    type: 'number',
    description: 'ID of the brand to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async deleteBrand(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.brandsService.delete(brandId);
      return {
        message: 'Brand deleted successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }
}
