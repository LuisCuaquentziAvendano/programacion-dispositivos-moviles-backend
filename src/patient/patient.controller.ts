import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { URL_PREFIX } from 'src/utils/variables';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { User } from '@prisma/client';
import type { Request } from 'express';
import { Roles } from 'src/user/guards/roles.decorator';
import { UserRole } from 'src/utils/user-role';
import { IdParamDto } from 'src/utils/id.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller(`${URL_PREFIX}/patients`)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @Post()
  async create(
    @Req() req: Request,
    @Body() patientData: CreatePatientDto,
  ): Promise<PatientDto> {
    const user = req.user as User;
    return this.patientService.create(patientData, user.organizationId!);
  }

  @Get(':id')
  async getById(
    @Req() req: Request,
    @Param() param: IdParamDto,
  ): Promise<PatientDto> {
    const user = req.user as User;
    return this.patientService.getById(param.id, user.organizationId!);
  }

  @Get()
  async getByQuery(
    @Req() req: Request,
    @Query('query') query: string,
  ): Promise<PatientDto[]> {
    const user = req.user as User;
    return this.patientService.getByQuery(query, user.organizationId!);
  }
}
