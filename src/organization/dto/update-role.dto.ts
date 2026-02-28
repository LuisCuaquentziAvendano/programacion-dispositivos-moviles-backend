import { IsString, IsInt, IsPositive, IsIn } from 'class-validator';
import { UserRole } from 'src/utils/user-role';

export class UpdateRoleDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsString()
  @IsIn([UserRole.SECRETARY, UserRole.THERAPIST])
  role: UserRole;
}
