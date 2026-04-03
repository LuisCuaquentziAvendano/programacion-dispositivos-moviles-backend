import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { MAX_STRING_SIZE } from 'src/utils/variables';

export class CreateAppointmentDto {
  @IsInt()
  @IsPositive()
  patientId: number;

  @IsInt()
  @IsPositive()
  therapistId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  serviceId?: number;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_STRING_SIZE)
  notes?: string;
}
