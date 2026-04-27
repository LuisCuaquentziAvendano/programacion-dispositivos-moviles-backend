import { Injectable } from '@nestjs/common';
import { UserDbService } from 'src/database/user-db.service';
import { User } from '@prisma/client';
import { formatUser, UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userDbService: UserDbService) {}

  getMyData(user: User): UserDto {
    return formatUser(user);
  }

  async getById(id: number, organizationId: number): Promise<UserDto> {
    const user = await this.userDbService.getByIdOrThrow(id, organizationId);
    return formatUser(user);
  }

  async getByQuery(
    query: string,
    role: string,
    organizationId: number,
  ): Promise<UserDto[]> {
    const users = await this.userDbService.getByQuery(
      query,
      role,
      organizationId,
    );
    return users.map((user) => formatUser(user));
  }
}
