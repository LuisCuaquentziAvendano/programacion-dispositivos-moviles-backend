import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  @IsPositive()
  patientId: number;

  @IsInt()
  @IsPositive()
  therapistId: number;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}
