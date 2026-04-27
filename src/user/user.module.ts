import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from './jwt-strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  controllers: [UserController],
  providers: [JwtStrategy, RolesGuard, UserService],
  imports: [ConfigModule, DatabaseModule, PassportModule],
  exports: [RolesGuard],
})
export class UserModule {}
