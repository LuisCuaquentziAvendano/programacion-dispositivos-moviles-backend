import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Organization, Prisma } from '@prisma/client';
import { UserRole } from 'src/utils/user-role';

@Injectable()
export class OrganizationDbService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(
    organizationData: Prisma.OrganizationCreateInput,
    userId: number,
  ): Promise<Organization> {
    const organization = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: organizationData,
      });
      await tx.user.update({
        data: {
          organizationId: organization.id,
          role: UserRole.ADMIN,
        },
        where: { id: userId },
      });
      return organization;
    });
    return organization;
  }

  async getById(id: number): Promise<Organization | null> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });
    return organization;
  }
}
