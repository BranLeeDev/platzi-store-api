import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(255)
  readonly description: string;
}
