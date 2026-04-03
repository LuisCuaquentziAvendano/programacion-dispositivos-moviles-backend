import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Appointment, Patient, Prisma, Service, User } from '@prisma/client';

@Injectable()
export class AppointmentDbService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    appointmentData: Prisma.AppointmentCreateInput,
  ): Promise<Appointment> {
    const appointment = await this.databaseService.appointment.create({
      data: appointmentData,
    });
    return appointment;
  }

  async getById(
    appointmentId: number,
    organizationId: number,
  ): Promise<AppointmentExtended | null> {
    const appointment = await this.databaseService.appointment.findUnique({
      select: {
        id: true,
        startDate: true,
        endDate: true,
        notes: true,
        patientId: true,
        therapistId: true,
        organizationId: true,
        serviceId: true,
        patient: true,
        therapist: true,
        service: true,
      },
      where: { id: appointmentId, organizationId },
    });
    return appointment;
  }

  async getByQuery(query: QueryAppointment): Promise<AppointmentExtended[]> {
    const databaseQuery: Prisma.AppointmentWhereInput = {
      organizationId: query.organizationId,
    };
    if (query.patientId) databaseQuery.patientId = query.patientId;
    if (query.therapistId) databaseQuery.therapistId = query.therapistId;
    if (query.rangeStart && query.rangeEnd)
      databaseQuery.OR = [
        {
          startDate: {
            gte: query.rangeStart,
            lt: query.rangeEnd,
          },
        },
        {
          endDate: {
            gt: query.rangeStart,
            lte: query.rangeEnd,
          },
        },
        {
          startDate: {
            lt: query.rangeStart,
          },
          endDate: {
            gt: query.rangeEnd,
          },
        },
      ];
    const appointments = await this.databaseService.appointment.findMany({
      select: {
        id: true,
        startDate: true,
        endDate: true,
        notes: true,
        patientId: true,
        therapistId: true,
        organizationId: true,
        serviceId: true,
        patient: true,
        therapist: true,
        service: true,
      },
      where: databaseQuery,
      orderBy: [{ startDate: 'asc' }, { endDate: 'asc' }],
    });
    return appointments;
  }

  async updateNotes(
    appointmentId: number,
    organizationId: number,
    notes: string,
  ): Promise<Appointment> {
    const appointment = await this.databaseService.appointment.update({
      data: { notes },
      where: { id: appointmentId, organizationId },
    });
    return appointment;
  }
}

type AppointmentExtended = Appointment & {
  patient: Patient;
  therapist: User;
  service: Service | null;
};

class QueryAppointment {
  patientId: number | null;
  therapistId: number | null;
  organizationId: number;
  rangeStart: Date | null;
  rangeEnd: Date | null;
}
