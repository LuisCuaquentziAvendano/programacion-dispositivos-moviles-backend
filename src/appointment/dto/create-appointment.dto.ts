import { IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';

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
}
