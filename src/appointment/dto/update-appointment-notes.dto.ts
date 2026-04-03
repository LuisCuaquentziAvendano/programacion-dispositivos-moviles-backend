import { IsString, MaxLength } from 'class-validator';
import { MAX_STRING_SIZE } from 'src/utils/variables';

export class UpdateAppointmentNotesDto {
  @IsString()
  @MaxLength(MAX_STRING_SIZE)
  notes: string;
}
