import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    description: 'Name of the brand',
    minLength: 3,
    maxLength: 30,
    example: 'Example Brand',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;

  @ApiProperty({
    description: 'Description of the brand',
    minLength: 15,
    maxLength: 255,
    example: 'This is an example brand description',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(255)
  readonly description: string;
}
