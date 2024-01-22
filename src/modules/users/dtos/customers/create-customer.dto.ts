// NestJS modules
import { ApiProperty } from '@nestjs/swagger';

// Third-party libraries
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxDate,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// Type imports
import { GENDERS } from '../../types/enums';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'The first name of the customer.',
    minLength: 3,
    maxLength: 40,
    example: 'Brandon',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  readonly firstName: string;

  @ApiProperty({
    description: 'The last name of the customer.',
    minLength: 3,
    maxLength: 40,
    example: 'Agüero',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  readonly lastName: string;

  @ApiProperty({
    enum: GENDERS,
    description: 'The gender of the customer',
    example: 'male',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(GENDERS)
  readonly gender: GENDERS;

  @ApiProperty({
    description: 'The date of birth of the customer.',
    example: '2004-08-02',
  })
  @IsNotEmpty()
  @IsDate()
  @MinDate(new Date('1990-01-01'))
  @MaxDate(() => {
    const dateString = new Date().toISOString().split('T')[0];
    return new Date(dateString);
  })
  @Type(() => Date)
  readonly dateOfBirth: Date;
}
