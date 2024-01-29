import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ROLES } from '../../types/enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the new user. Should be unique',
    minLength: 3,
    maxLength: 20,
    example: 'branleedev',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  readonly username: string;

  @ApiProperty({
    description: 'Email address for the new user. Should be unique',
    minLength: 11,
    maxLength: 320,
    example: 'brandonaguerodeveloper@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(11)
  @MaxLength(320)
  readonly email: string;

  @ApiProperty({
    description: 'Password for the new user',
    minLength: 8,
    maxLength: 100,
    example: 'W1RS}4u0',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(8)
  @MaxLength(100)
  readonly password: string;

  @ApiProperty({
    description: 'Role of the new user (optional)',
    enum: ROLES,
    required: false,
    example: 'customer',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(ROLES)
  readonly role?: ROLES;

  @ApiProperty({
    description: 'Master password (required if role is admin)',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((object) => object.role === 'admin')
  readonly masterPassword?: string;

  @ApiProperty({
    description: 'Customer ID associated with the user (optional)',
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly customerId?: number;
}
