import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Prisma, User } from '@prisma/client';
import { someFieldContainsQuery } from 'src/utils/database-query-builder';
import { UserRole } from 'src/utils/user-role';

@Injectable()
export class UserDbService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userData: Prisma.UserCreateInput): Promise<User> {
    const user = await this.databaseService.user.create({
      data: userData,
    });
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    return user;
  }

  async getByUid(uid: string): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: { uid },
    });
    return user;
  }

  async getById(userId: number, organizationId?: number): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId, organizationId },
    });
    return user;
  }

  async getByIdOrThrow(userId: number, organizationId?: number): Promise<User> {
    const user = await this.getById(userId, organizationId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getByQuery(
    query: string,
    role: string,
    organizationId: number,
  ): Promise<User[]> {
    const databaseQuery: Prisma.UserWhereInput = {
      organizationId,
    };
    if (query)
      databaseQuery.OR = someFieldContainsQuery(['name', 'email'], query);
    if (role) databaseQuery.role = role;
    const users = await this.databaseService.user.findMany({
      where: databaseQuery,
    });
    return users;
  }

  async getOrganizationOwner(organizationId: number): Promise<User> {
    const user = await this.databaseService.user.findFirst({
      where: {
        organizationId,
        role: UserRole.ADMIN,
      },
    });
    return user!;
  }

  async updateOrganization(
    organizationId: number,
    userId: number,
    role: UserRole,
  ): Promise<User> {
    const user = await this.databaseService.user.update({
      data: {
        organizationId,
        role,
      },
      where: { id: userId },
    });
    return user;
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.databaseService.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.databaseService.user.delete({
      where: { id },
    });
  }
}
