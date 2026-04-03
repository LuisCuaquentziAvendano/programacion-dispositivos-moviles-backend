import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PatientDbService } from 'src/database/patient-db.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentDto, formatAppointment } from './dto/appointment.dto';
import { AppointmentDbService } from 'src/database/appointment-db.service';
import { UserDbService } from 'src/database/user-db.service';
import { UserRole } from 'src/utils/user-role';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';
import { ServiceDbService } from 'src/database/service-db.service';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentDbService: AppointmentDbService,
    private readonly patientDbService: PatientDbService,
    private readonly userDbService: UserDbService,
    private readonly serviceDbService: ServiceDbService,
  ) {}

  async create(
    appointmentData: CreateAppointmentDto,
    organizationId: number,
  ): Promise<AppointmentDto> {
    const patient = await this.patientDbService.getByIdOrThrow(
      appointmentData.patientId,
      organizationId,
    );
    const therapist = await this.userDbService.getByIdOrThrow(
      appointmentData.therapistId,
      organizationId,
    );
    const service = appointmentData.serviceId
      ? await this.serviceDbService.getByIdOrThrow(
          appointmentData.serviceId,
          organizationId,
        )
      : null;
    if (therapist.role != UserRole.THERAPIST)
      throw new BadRequestException('The user must be a therapist');
    if (appointmentData.startDate >= appointmentData.endDate)
      throw new BadRequestException('Start date must be previous to end date');
    await this.checkPatientScheduleConflicts(appointmentData, organizationId);
    await this.checkTherapistScheduleConflicts(appointmentData, organizationId);
    const appointment = await this.appointmentDbService.create({
      startDate: appointmentData.startDate,
      endDate: appointmentData.endDate,
      notes: appointmentData.notes || '',
      patient: { connect: { id: appointmentData.patientId } },
      therapist: { connect: { id: appointmentData.therapistId } },
      organization: { connect: { id: organizationId } },
      ...(appointmentData.serviceId
        ? { service: { connect: { id: appointmentData.serviceId } } }
        : {}),
    });
    return formatAppointment(appointment, patient, therapist, service);
  }

  async getById(
    appointmentId: number,
    organizationId: number,
  ): Promise<AppointmentDto> {
    const appointment = await this.appointmentDbService.getById(
      appointmentId,
      organizationId,
    );
    if (!appointment) throw new NotFoundException('Appointment not found');
    return formatAppointment(
      appointment,
      appointment.patient,
      appointment.therapist,
      appointment.service,
    );
  }

  async getByQuery(
    query: QueryAppointmentsDto,
    organizationId: number,
  ): Promise<AppointmentDto[]> {
    if (
      (query.rangeStart && !query.rangeEnd) ||
      (!query.rangeStart && query.rangeEnd)
    )
      throw new BadRequestException(
        'Both start and end of range must be provided or none of them',
      );
    if (
      query.rangeStart &&
      query.rangeEnd &&
      query.rangeStart >= query.rangeEnd
    )
      throw new BadRequestException(
        'Start of range must be previous to end of range',
      );
    const appointments = await this.appointmentDbService.getByQuery({
      ...query,
      organizationId,
    });
    return appointments.map((appointment) =>
      formatAppointment(
        appointment,
        appointment.patient,
        appointment.therapist,
        appointment.service,
      ),
    );
  }

  async updateNotes(
    appointmentId: number,
    notes: string,
    therapistId: number,
    organizationId: number,
  ): Promise<AppointmentDto> {
    const appointmentFound = await this.appointmentDbService.getById(
      appointmentId,
      organizationId,
    );
    if (!appointmentFound) throw new NotFoundException('Appointment not found');
    if (appointmentFound.therapistId !== therapistId)
      throw new BadRequestException(
        'Only the assigned therapist can update appointment notes',
      );
    await this.appointmentDbService.updateNotes(
      appointmentId,
      organizationId,
      notes,
    );
    const appointmentUpdated = await this.appointmentDbService.getById(
      appointmentId,
      organizationId,
    );
    if (!appointmentUpdated)
      throw new NotFoundException('Appointment not found');
    return formatAppointment(
      appointmentUpdated,
      appointmentUpdated.patient,
      appointmentUpdated.therapist,
      appointmentUpdated.service,
    );
  }

  private async checkPatientScheduleConflicts(
    appointmentData: CreateAppointmentDto,
    organizationId: number,
  ): Promise<void> {
    const patientAppointments = await this.appointmentDbService.getByQuery({
      patientId: appointmentData.patientId,
      therapistId: null,
      organizationId,
      rangeStart: appointmentData.startDate,
      rangeEnd: appointmentData.endDate,
    });
    if (patientAppointments.length > 0)
      throw new BadRequestException(
        "There is a conflict in the patient's schedule",
      );
  }

  private async checkTherapistScheduleConflicts(
    appointmentData: CreateAppointmentDto,
    organizationId: number,
  ): Promise<void> {
    const therapistAppointments = await this.appointmentDbService.getByQuery({
      patientId: null,
      therapistId: appointmentData.therapistId,
      organizationId,
      rangeStart: appointmentData.startDate,
      rangeEnd: appointmentData.endDate,
    });
    if (therapistAppointments.length > 0)
      throw new BadRequestException(
        "There is a conflict in the therapist's schedule",
      );
  }
}
