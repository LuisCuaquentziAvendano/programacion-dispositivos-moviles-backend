import { IsString, IsEnum, IsInt, IsPositive } from 'class-validator';
import { UserRole } from 'src/utils/user-role';

export class UpdateRoleDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsString()
  @IsEnum([UserRole.SECRETARY, UserRole.THERAPIST])
  role: UserRole;
}
