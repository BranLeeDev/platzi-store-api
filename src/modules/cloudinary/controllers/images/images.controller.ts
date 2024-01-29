// NestJS modules
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

// Entities
import { Image } from '../../entities/image.entity';

// Services
import { ImagesService } from '../../services/images/images.service';

// Controllers
import { BaseController } from '../../../common/base.controller';

// Types imports
import { ROLES } from '../../../users/types/enums';

// Auth imports
import { RolesGuard } from '../../../auth/guards/roles/roles.guard';
import { Public } from '../../../auth/decorators/public.decorator';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('images')
@Controller('images')
export class ImagesController extends BaseController {
  constructor(private readonly imagesService: ImagesService) {
    super();
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all images',
    description: 'Retrieve a list of all images',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all customers',
    type: [Image],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getAllImages(@Body() body: any) {
    try {
      this.validateEmptyBody(body);
      const res = await this.imagesService.findAll();
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Roles(ROLES.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiOperation({ summary: 'Upload an image' })
  @ApiResponse({
    status: 201,
    description: 'The image was uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Unexpected field - Bad Request' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 368640,
          message: 'Validation failed (expected size is less than 360KB)',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    imageFile: Express.Multer.File,
  ) {
    try {
      const res = await this.imagesService.uploadImage(imageFile);
      const { width, height, secure_url, bytes, format, public_id, imageId } =
        res;
      return {
        message: 'The image was uploaded successfully',
        data: {
          id: imageId,
          widthPixels: width,
          heightPixels: height,
          imageUrl: secure_url,
          bytesSize: bytes,
          imageType: format,
          publicId: public_id,
        },
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Public()
  @Get(':imageId')
  @ApiOperation({
    summary: 'Get image by ID',
    description: 'Retrieve details of a specific image by ID',
  })
  @ApiParam({
    name: 'imageId',
    type: 'number',
    description: 'ID of the image',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Image details', type: Image })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 404,
    description: 'Image not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getImage(
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.imagesService.findOne(imageId);
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Roles(ROLES.ADMIN)
  @Delete(':imageId')
  @ApiOperation({
    summary: 'Delete image by ID',
    description: 'Delete a specif image by ID',
  })
  @ApiParam({
    name: 'imageId',
    type: 'number',
    description: 'ID of the image to delete',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async deleteImage(
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.imagesService.deleteImage(imageId);
      return {
        message: 'Image deleted successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }
}
