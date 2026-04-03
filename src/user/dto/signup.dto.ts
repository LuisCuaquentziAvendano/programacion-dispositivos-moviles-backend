import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { MAX_STRING_SIZE } from 'src/utils/variables';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_STRING_SIZE)
  name: string;

  @IsEmail()
  @MaxLength(MAX_STRING_SIZE)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_STRING_SIZE)
  phoneNumber: string;

  @IsStrongPassword()
  @MaxLength(MAX_STRING_SIZE)
  password: string;
}
