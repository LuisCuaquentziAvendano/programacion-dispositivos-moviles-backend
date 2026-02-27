import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientDbService } from 'src/database/patient-db.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { formatPatient, PatientDto } from './dto/patient.dto';

@Injectable()
export class PatientService {
  constructor(private readonly patientDbService: PatientDbService) {}

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
    const patient = await this.patientDbService.getById(
      patientId,
      organizationId,
    );
    if (!patient) throw new NotFoundException('Patient not found');
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
}
