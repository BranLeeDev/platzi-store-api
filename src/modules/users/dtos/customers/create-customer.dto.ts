import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
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

  @IsString()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly dateOfBirth: Date;
}
