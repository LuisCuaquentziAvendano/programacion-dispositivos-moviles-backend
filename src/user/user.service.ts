import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { UserDbService } from 'src/database/user-db.service';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { compare, hash } from 'bcrypt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { formatUser, UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly ENCRYPTION_ROUNDS = 10;

  constructor(
    private readonly userDbService: UserDbService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(userData: SignupDto): Promise<JwtTokenDto> {
    const userFound = await this.userDbService.getByEmail(userData.email);
    if (userFound) throw new BadRequestException('Email already registered');
    const passwordHash = await hash(userData.password, this.ENCRYPTION_ROUNDS);
    const user = await this.userDbService.create({
      email: userData.email,
      name: userData.name,
      password: passwordHash,
    });
    const payload: JwtPayloadDto = { userId: user.id };
    return { authorization: this.jwtService.sign(payload) };
  }

  async login(userData: LoginDto): Promise<JwtTokenDto> {
    const user = await this.userDbService.getByEmail(userData.email);
    if (!user) throw new UnauthorizedException();
    const validPassword = await compare(userData.password, user.password);
    if (!validPassword) throw new UnauthorizedException();
    const payload: JwtPayloadDto = { userId: user.id };
    return { authorization: this.jwtService.sign(payload) };
  }

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
