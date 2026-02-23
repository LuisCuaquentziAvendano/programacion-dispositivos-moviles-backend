import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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

@Controller(`${URL_PREFIX}/users`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() userData: SignupDto): Promise<JwtTokenDto> {
    return this.userService.signup(userData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() userData: LoginDto): Promise<JwtTokenDto> {
    return this.userService.login(userData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getData(@Req() req: Request): UserDto {
    const user = req.user as User;
    return {
      email: user.email,
      name: user.name,
    };
  }
}
