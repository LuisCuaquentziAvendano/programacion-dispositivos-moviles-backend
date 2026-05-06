import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { URL_PREFIX } from 'src/utils/variables';
import type { Request } from 'express';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { UserRole } from 'src/utils/user-role';
import { Roles } from './guards/roles.decorator';
import { IdParamDto } from 'src/utils/id.dto';
import { QueryUsersDto } from './dto/query-users.dto';

@Controller(`${URL_PREFIX}/users`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyData(@Req() req: Request): UserDto {
    const user = req.user as User;
    return this.userService.getMyData(user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @Post()
  async create(
    @Req() req: Request,
    @Body() userData: CreateUserDto,
  ): Promise<UserDto> {
    const user = req.user as User;
    return this.userService.create(userData, user.organizationId!);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param() param: IdParamDto,
    @Body() userData: UpdateUserDto,
  ): Promise<UserDto> {
    const user = req.user as User;
    return this.userService.update(param.id, user.organizationId!, userData);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Req() req: Request, @Param() param: IdParamDto): Promise<void> {
    const user = req.user as User;
    await this.userService.delete(param.id, user.organizationId!);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @Get(':id')
  async getById(
    @Req() req: Request,
    @Param() param: IdParamDto,
  ): Promise<UserDto> {
    const user = req.user as User;
    return this.userService.getById(param.id, user.organizationId!);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  @Get()
  async getByQuery(
    @Req() req: Request,
    @Query() query: QueryUsersDto,
  ): Promise<UserDto[]> {
    const user = req.user as User;
    return this.userService.getByQuery(query, user.id, user.organizationId!);
  }
}
