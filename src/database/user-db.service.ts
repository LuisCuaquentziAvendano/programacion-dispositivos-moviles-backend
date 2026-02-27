import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Prisma, User } from '@prisma/client';
import { someFieldContainsQuery } from 'src/utils/prisma-query-builder';
import { UserRole } from 'src/utils/user-role';
import { formatUser, UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class UserDbService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(userData: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async getById(userId: number, organizationId?: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, organizationId },
    });
    return user;
  }

  async getByQuery(query: string, organizationId: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        AND: [
          { organizationId },
          someFieldContainsQuery(['name', 'email'], query),
        ],
      },
    });
    return users;
  }

  async getOrganizationOwner(organizationId: number): Promise<User> {
    const user = await this.prisma.user.findFirst({
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
  ): Promise<UserDto> {
    const user = await this.prisma.user.update({
      data: {
        organizationId,
        role,
      },
      where: { id: userId },
    });
    return formatUser(user);
  }
}
