import { Injectable, BadRequestException } from '@nestjs/common';
import { UserDbService } from 'src/database/user-db.service';
import { User } from '@prisma/client';
import { formatUser, UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { getFirebaseAuth } from './firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly userDbService: UserDbService,
    private readonly configService: ConfigService,
  ) {}

  getMyData(user: User): UserDto {
    return formatUser(user);
  }

  async getById(id: number, organizationId: number): Promise<UserDto> {
    const user = await this.userDbService.getByIdOrThrow(id, organizationId);
    return formatUser(user);
  }

  async getByQuery(
    dto: QueryUsersDto,
    userId: number,
    organizationId: number,
  ): Promise<UserDto[]> {
    const users = await this.userDbService.getByQuery(
      dto.query,
      dto.role,
      userId,
      organizationId,
    );
    return users.map((user) => formatUser(user));
  }

  async create(
    createDto: CreateUserDto,
    organizationId: number,
  ): Promise<UserDto> {
    const auth = getFirebaseAuth(this.configService);

    // Create in Firebase first
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email: createDto.email,
        displayName: createDto.name,
        password: 'password123', // default password
      });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      throw new BadRequestException(
        'Could not create user in Firebase: ' + errorMsg,
      );
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const userUid = String(userRecord.uid);
      const user = await this.userDbService.create({
        uid: userUid,
        name: createDto.name,
        email: createDto.email,
        phoneNumber: createDto.phoneNumber,
        role: createDto.role || 'therapist',
        organization: { connect: { id: organizationId } },
      });
      return formatUser(user);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (userRecord && userRecord.uid) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        await auth.deleteUser(userRecord.uid);
      }
      throw e;
    }
  }

  async update(
    id: number,
    organizationId: number,
    updateDto: UpdateUserDto,
  ): Promise<UserDto> {
    const existing = await this.userDbService.getByIdOrThrow(
      id,
      organizationId,
    );

    const updated = await this.userDbService.update(id, {
      name: updateDto.name,
      email: updateDto.email,
      phoneNumber: updateDto.phoneNumber,
      role: updateDto.role,
    });

    // Optionally update in Firebase
    if (updateDto.email || updateDto.name) {
      try {
        const auth = getFirebaseAuth(this.configService);
        await auth.updateUser(existing.uid, {
          email: updateDto.email,
          displayName: updateDto.name,
        });
      } catch {
        // ignore errors
      }
    }

    return formatUser(updated);
  }

  async delete(id: number, organizationId: number): Promise<void> {
    const existing = await this.userDbService.getByIdOrThrow(
      id,
      organizationId,
    );

    await this.userDbService.delete(id);

    try {
      const auth = getFirebaseAuth(this.configService);
      await auth.deleteUser(existing.uid);
    } catch {
      // ignore
    }
  }
}
