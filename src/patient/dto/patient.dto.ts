import { Patient } from '@prisma/client';

export class PatientDto {
  email: string | null;
  name: string | null;
  phoneNumber: string | null;
}

export function formatPatient(patient: Patient): PatientDto {
  return {
    email: patient.email,
    name: patient.name,
    phoneNumber: patient.phoneNumber,
  };
}
