import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { MAX_STRING_SIZE } from 'src/utils/variables';

export class CreatePatientDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsEmail()
  @MaxLength(MAX_STRING_SIZE)
  email: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_STRING_SIZE)
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_STRING_SIZE)
  phoneNumber: string | null;
}
