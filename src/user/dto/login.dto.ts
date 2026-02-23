import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';
import { MAX_STRING_SIZE } from 'src/utils/variables';

export class LoginDto {
  @IsEmail()
  @MaxLength(MAX_STRING_SIZE)
  email: string;

  @IsStrongPassword()
  @MaxLength(MAX_STRING_SIZE)
  password: string;
}
