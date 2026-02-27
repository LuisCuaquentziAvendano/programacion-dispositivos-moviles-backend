import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from './jwt-strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  controllers: [UserController],
  providers: [JwtStrategy, RolesGuard, UserService],
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  exports: [RolesGuard],
})
export class UserModule {}
