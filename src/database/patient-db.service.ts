import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Patient, Prisma } from '@prisma/client';
import { someFieldContainsQuery } from 'src/utils/prisma-query-builder';

@Injectable()
export class PatientDbService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(patientData: Prisma.PatientCreateInput): Promise<Patient> {
    const patient = await this.prisma.patient.create({
      data: patientData,
    });
    return patient;
  }

  async getById(
    patientId: number,
    organizationId: number,
  ): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, organizationId },
    });
    return patient;
  }

  async getByQuery(query: string, organizationId: number): Promise<Patient[]> {
    const patients = await this.prisma.patient.findMany({
      where: {
        AND: [
          { organizationId },
          someFieldContainsQuery(['name', 'email', 'phoneNumber'], query),
        ],
      },
    });
    return patients;
  }
}
