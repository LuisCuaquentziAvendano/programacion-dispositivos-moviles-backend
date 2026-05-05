import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppointmentDbService } from 'src/database/appointment-db.service';
import { PatientDbService } from 'src/database/patient-db.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { formatPatient, PatientDto } from './dto/patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientDbService: PatientDbService,
    private readonly appointmentDbService: AppointmentDbService,
  ) {}

  async create(
    patientData: CreatePatientDto,
    organizationId: number,
  ): Promise<PatientDto> {
    const patient = await this.patientDbService.create({
      ...patientData,
      organization: { connect: { id: organizationId } },
    });
    return formatPatient(patient);
  }

  async getById(
    patientId: number,
    organizationId: number,
  ): Promise<PatientDto> {
    const patient = await this.patientDbService.getByIdOrThrow(
      patientId,
      organizationId,
    );
    return formatPatient(patient);
  }

  async getByQuery(
    query: string,
    organizationId: number,
  ): Promise<PatientDto[]> {
    const patients = await this.patientDbService.getByQuery(
      query,
      organizationId,
    );
    return patients.map((patient) => formatPatient(patient));
  }

  async update(
    patientId: number,
    organizationId: number,
    data: UpdatePatientDto,
  ): Promise<PatientDto> {
    const existing = await this.patientDbService.getByIdOrThrow(
      patientId,
      organizationId,
    );
    const prismaData: Prisma.PatientUpdateInput = {};
    if (data.name !== undefined) prismaData.name = data.name;
    if (data.email !== undefined) prismaData.email = data.email;
    if (data.phoneNumber !== undefined)
      prismaData.phoneNumber = data.phoneNumber;
    if (Object.keys(prismaData).length === 0) return formatPatient(existing);
    const patient = await this.patientDbService.update(patientId, prismaData);
    return formatPatient(patient);
  }

  async delete(patientId: number, organizationId: number): Promise<void> {
    await this.patientDbService.getByIdOrThrow(patientId, organizationId);
    const appointmentCount =
      await this.appointmentDbService.countByPatientId(patientId);
    if (appointmentCount > 0)
      throw new ConflictException(
        'Cannot delete patient with existing appointments',
      );
    await this.patientDbService.delete(patientId);
  }
}
