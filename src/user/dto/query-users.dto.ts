import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from 'src/utils/user-role';

export class QueryUsersDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
