import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UserService } from './user.service';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { LoginDto } from './dto/login.dto';
import { URL_PREFIX } from 'src/utils/variables';
import type { Request } from 'express';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { UserRole } from 'src/utils/user-role';
import { Roles } from './guards/roles.decorator';

@Controller(`${URL_PREFIX}/users`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() userData: SignupDto): Promise<JwtTokenDto> {
    return this.userService.signup(userData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() userData: LoginDto): Promise<JwtTokenDto> {
    return this.userService.login(userData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyData(@Req() req: Request): UserDto {
    const user = req.user as User;
    return this.userService.getMyData(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @UseGuards(RolesGuard)
  @Get(':id')
  async getById(@Req() req: Request, @Param() id: number): Promise<UserDto> {
    const user = req.user as User;
    return this.userService.getById(id, user.organizationId!);
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @UseGuards(RolesGuard)
  @Get()
  async getByQuery(
    @Req() req: Request,
    @Query('query') query: string,
  ): Promise<UserDto[]> {
    const user = req.user as User;
    return this.userService.getByQuery(query, user.organizationId!);
  }
}
