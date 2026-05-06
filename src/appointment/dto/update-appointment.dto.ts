import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  patientId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  therapistId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  serviceId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
