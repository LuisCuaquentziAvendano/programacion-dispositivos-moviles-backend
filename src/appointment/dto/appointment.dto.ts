import { Appointment, Patient, Service, User } from '@prisma/client';
import { formatPatient, PatientDto } from 'src/patient/dto/patient.dto';
import { formatUser, UserDto } from 'src/user/dto/user.dto';
import { formatService, ServiceDto } from 'src/service/dto/service.dto';

export class AppointmentDto {
  id: number;
  startDate: Date;
  endDate: Date;
  notes: string;
  patient: PatientDto;
  therapist: UserDto;
  service: ServiceDto | null;
}

export function formatAppointment(
  appointment: Appointment,
  patient: Patient,
  therapist: User,
  service: Service | null,
): AppointmentDto {
  return {
    id: appointment.id,
    startDate: appointment.startDate,
    endDate: appointment.endDate,
    notes: appointment.notes,
    patient: formatPatient(patient),
    therapist: formatUser(therapist),
    service: service ? formatService(service) : null,
  };
}
