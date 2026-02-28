import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';

export class QueryAppointmentsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  patientId: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  therapistId: number | null;

  @IsOptional()
  @IsDateString()
  rangeStart: Date | null;

  @IsOptional()
  @IsDateString()
  rangeEnd: Date | null;
}
