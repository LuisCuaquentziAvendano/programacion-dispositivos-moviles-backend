import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MAX_STRING_SIZE } from 'src/utils/variables';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_STRING_SIZE)
  name: string;
}
