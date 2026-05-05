import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Patient, Prisma } from '@prisma/client';
import { someFieldContainsQuery } from 'src/utils/database-query-builder';

@Injectable()
export class PatientDbService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(patientData: Prisma.PatientCreateInput): Promise<Patient> {
    const patient = await this.databaseService.patient.create({
      data: patientData,
    });
    return patient;
  }

  async getById(
    patientId: number,
    organizationId: number,
  ): Promise<Patient | null> {
    const patient = await this.databaseService.patient.findUnique({
      where: { id: patientId, organizationId },
    });
    return patient;
  }

  async getByIdOrThrow(
    patientId: number,
    organizationId: number,
  ): Promise<Patient> {
    const patient = await this.getById(patientId, organizationId);
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async getByQuery(query: string, organizationId: number): Promise<Patient[]> {
    const databaseQuery: Prisma.PatientWhereInput = {
      organizationId,
    };
    if (query)
      databaseQuery.OR = someFieldContainsQuery(
        ['name', 'email', 'phoneNumber'],
        query,
      );
    const patients = await this.databaseService.patient.findMany({
      where: databaseQuery,
    });
    return patients;
  }

  async delete(id: number): Promise<void> {
    await this.databaseService.patient.delete({
      where: { id },
    });
  }

  async update(
    id: number,
    data: Prisma.PatientUpdateInput,
  ): Promise<Patient> {
    return this.databaseService.patient.update({
      where: { id },
      data,
    });
  }
}
