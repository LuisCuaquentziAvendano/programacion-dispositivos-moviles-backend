import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { URL_PREFIX } from 'src/utils/variables';
import { OrganizationService } from './organization.service';
import type { Request } from 'express';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { User } from '@prisma/client';
import { OrganizationDto } from './dto/organization.dto';
import { Roles } from 'src/user/guards/roles.decorator';
import { UserRole } from 'src/utils/user-role';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserDto } from 'src/user/dto/user.dto';

@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller(`${URL_PREFIX}/organizations`)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() organizationData: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    const user = req.user as User;
    return this.organizationService.create(organizationData, user);
  }

  @Get()
  async getMyOrganization(@Req() req: Request): Promise<OrganizationDto> {
    const user = req.user as User;
    return this.organizationService.getMyOrganization(user);
  }

  @Put('role')
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Req() req: Request,
    @Body() roleData: UpdateRoleDto,
  ): Promise<UserDto> {
    const user = req.user as User;
    if (!user.organizationId)
      throw new BadRequestException('You have not created an organization');
    return this.organizationService.updateUserRole(
      user.organizationId,
      roleData.userId,
      roleData.role,
    );
  }
}
