import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { URL_PREFIX } from 'src/utils/variables';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { User } from '@prisma/client';
import type { Request } from 'express';
import { Roles } from 'src/user/guards/roles.decorator';
import { UserRole } from 'src/utils/user-role';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';
import { IdParamDto } from 'src/utils/id.dto';
import { UpdateAppointmentNotesDto } from './dto/update-appointment-notes.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller(`${URL_PREFIX}/appointments`)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @Post()
  async create(
    @Req() req: Request,
    @Body() appointmentData: CreateAppointmentDto,
  ): Promise<AppointmentDto> {
    appointmentData.startDate = new Date(appointmentData.startDate);
    appointmentData.endDate = new Date(appointmentData.endDate);
    const user = req.user as User;
    const googleAccessToken = req.headers['x-google-access-token'];
    return this.appointmentService.create(
      appointmentData,
      user.organizationId!,
      googleAccessToken,
    );
  }

  @Roles(UserRole.THERAPIST)
  @Get('therapist/me')
  async getMyAppointments(
    @Req() req: Request,
    @Query() query: QueryAppointmentsDto,
  ): Promise<AppointmentDto[]> {
    this.formatQuery(query);
    const user = req.user as User;
    return this.appointmentService.getByQuery(
      {
        patientId: null,
        therapistId: user.id,
        rangeStart: query.rangeStart,
        rangeEnd: query.rangeEnd,
      },
      user.organizationId!,
    );
  }

  @Get(':id')
  async getById(
    @Req() req: Request,
    @Param() param: IdParamDto,
  ): Promise<AppointmentDto> {
    const user = req.user as User;
    return this.appointmentService.getById(param.id, user.organizationId!);
  }

  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @Get()
  async getByQuery(
    @Req() req: Request,
    @Query() query: QueryAppointmentsDto,
  ): Promise<AppointmentDto[]> {
    this.formatQuery(query);
    const user = req.user as User;
    return this.appointmentService.getByQuery(
      {
        patientId: query.patientId,
        therapistId: query.therapistId,
        rangeStart: query.rangeStart,
        rangeEnd: query.rangeEnd,
      },
      user.organizationId!,
    );
  }

  @Roles(UserRole.THERAPIST)
  @Put(':id/notes')
  async updateNotes(
    @Req() req: Request,
    @Param() param: IdParamDto,
    @Body() notesData: UpdateAppointmentNotesDto,
  ): Promise<AppointmentDto> {
    const user = req.user as User;
    return await this.appointmentService.updateNotes(
      param.id,
      notesData.notes,
      user.id,
      user.organizationId!,
    );
  }

  private formatQuery(query: QueryAppointmentsDto): void {
    if (query.rangeStart) query.rangeStart = new Date(query.rangeStart);
    if (query.rangeEnd) query.rangeEnd = new Date(query.rangeEnd);
    if (!query.patientId) query.patientId = null;
    if (!query.therapistId) query.therapistId = null;
    if (!query.rangeStart) query.rangeStart = null;
    if (!query.rangeEnd) query.rangeEnd = null;
  }
}
