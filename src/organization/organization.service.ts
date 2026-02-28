import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDbService } from 'src/database/user-db.service';
import { OrganizationDbService } from 'src/database/organization-db.service';
import { formatOrganization, OrganizationDto } from './dto/organization.dto';
import { User } from '@prisma/client';
import { formatUser, UserDto } from 'src/user/dto/user.dto';
import { UserRole } from 'src/utils/user-role';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationDbService: OrganizationDbService,
    private readonly userDbService: UserDbService,
  ) {}

  async create(
    organizationData: CreateOrganizationDto,
    creator: User,
  ): Promise<OrganizationDto> {
    if (creator.role)
      throw new BadRequestException('You already belong to a organization');
    const organization = await this.organizationDbService.create(
      organizationData,
      creator.id,
    );
    return formatOrganization(organization, creator);
  }

  async getMyOrganization(user: User): Promise<OrganizationDto> {
    const organization = (await this.organizationDbService.getById(
      user.organizationId!,
    ))!;
    const creator = await this.userDbService.getOrganizationOwner(
      organization?.id,
    );
    return formatOrganization(organization, creator);
  }

  async updateUserRole(
    organizationId: number,
    userId: number,
    role: UserRole,
  ): Promise<UserDto> {
    const user = await this.userDbService.getByIdOrThrow(userId);
    if (user.role) throw new BadRequestException("The role can't be changed");
    const userUpdated = await this.userDbService.updateOrganization(
      organizationId,
      userId,
      role,
    );
    return formatUser(userUpdated);
  }
}
