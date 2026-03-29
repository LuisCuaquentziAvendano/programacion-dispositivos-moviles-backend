import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import type { Request } from 'express';
import { Roles } from 'src/user/guards/roles.decorator';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { UserRole } from 'src/utils/user-role';
import { URL_PREFIX } from 'src/utils/variables';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceDto } from './dto/service.dto';
import { ServiceService } from './service.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller(`${URL_PREFIX}/services`)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Req() req: Request,
    @Body() serviceData: CreateServiceDto,
  ): Promise<ServiceDto> {
    const user = req.user as User;
    return this.serviceService.create(serviceData, user.organizationId!);
  }

  @Get()
  async getAll(@Req() req: Request): Promise<ServiceDto[]> {
    const user = req.user as User;
    return this.serviceService.getAll(user.organizationId!);
  }
}
