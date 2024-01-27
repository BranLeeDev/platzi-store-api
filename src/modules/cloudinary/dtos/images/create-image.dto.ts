import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { IMAGES_TYPES } from '../../types/enums';

export class CreateImageDto {
  @ApiProperty({ description: 'Width of the image in pixels', example: 560 })
  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  readonly width: number;

  @ApiProperty({ description: 'Height of the image in pixels', example: 500 })
  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  readonly height: number;

  @ApiProperty({
    description: 'URL of the image',
    example:
      'https://res.cloudinary.com/dbbixakcl/image/upload/v1706300071/platzi-store-api/images/wdlsqlyoe611pygevcok.png',
  })
  @IsString()
  @MinLength(13)
  @IsUrl()
  @IsNotEmpty()
  readonly image: string;

  @ApiProperty({ description: 'Size of the image in bytes', example: 15680 })
  @IsNumber()
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  readonly bytesSize: number;

  @ApiProperty({
    description: 'Type of the image',
    enum: IMAGES_TYPES,
    example: IMAGES_TYPES.JPG,
  })
  @IsEnum(IMAGES_TYPES)
  @IsNotEmpty()
  readonly imageType: IMAGES_TYPES;

  @ApiProperty({
    description: 'Public ID of the image',
    example: 'platzi-store-api/images/wdlsqlyoe611pygevcok',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(24)
  readonly publicId: string;
}
