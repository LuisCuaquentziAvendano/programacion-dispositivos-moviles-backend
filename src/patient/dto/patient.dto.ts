import { Patient } from '@prisma/client';

export class PatientDto {
  id: number;
  email: string | null;
  name: string;
  phoneNumber: string | null;
}

export function formatPatient(patient: Patient): PatientDto {
  return {
    id: patient.id,
    email: patient.email,
    name: patient.name,
    phoneNumber: patient.phoneNumber,
  };
}
