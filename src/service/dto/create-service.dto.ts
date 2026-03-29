import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { MAX_STRING_SIZE } from 'src/utils/variables';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_STRING_SIZE)
  name: string;

  @IsInt()
  @IsPositive()
  duration: number;
}
