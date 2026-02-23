import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserDbService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(userData: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  }

  async getById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}
