import { Appointment, Patient, User } from '@prisma/client';
import { formatPatient, PatientDto } from 'src/patient/dto/patient.dto';
import { formatUser, UserDto } from 'src/user/dto/user.dto';

export class AppointmentDto {
  id: number;
  startDate: Date;
  endDate: Date;
  patient: PatientDto;
  therapist: UserDto;
}

export function formatAppointment(
  appointment: Appointment,
  patient: Patient,
  therapist: User,
): AppointmentDto {
  return {
    id: appointment.id,
    startDate: appointment.startDate,
    endDate: appointment.endDate,
    patient: formatPatient(patient),
    therapist: formatUser(therapist),
  };
}
