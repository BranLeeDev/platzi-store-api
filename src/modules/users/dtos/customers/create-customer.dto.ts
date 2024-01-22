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
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(GENDERS)
  readonly gender: GENDERS;

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
