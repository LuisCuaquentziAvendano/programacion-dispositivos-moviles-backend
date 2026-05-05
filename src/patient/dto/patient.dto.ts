import { Patient } from '@prisma/client';

export class PatientDto {
  active: boolean;
  id: number;
  email: string | null;
  name: string;
  phoneNumber: string | null;
}

export function formatPatient(patient: Patient): PatientDto {
  return {
    active: patient.active,
    id: patient.id,
    email: patient.email,
    name: patient.name,
    phoneNumber: patient.phoneNumber,
  };
}
