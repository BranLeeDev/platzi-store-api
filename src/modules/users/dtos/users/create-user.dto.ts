import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ROLES } from '../../types/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the new user.',
    minLength: 3,
    maxLength: 20,
    example: 'branleedev',
    uniqueItems: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  readonly username: string;

  @ApiProperty({
    description: 'Email address for the new user.',
    minLength: 11,
    maxLength: 320,
    example: 'brandonaguerodeveloper@gmail.com',
    uniqueItems: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(11)
  @MaxLength(320)
  readonly email: string;

  @ApiProperty({
    description: 'Password for the new user.',
    minLength: 8,
    maxLength: 100,
    example: 'W1RS}4u0',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  readonly password: string;

  @ApiProperty({
    description: 'Role of the new user (optional).',
    enum: ROLES,
    required: false,
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(ROLES)
  readonly role?: ROLES;
}
