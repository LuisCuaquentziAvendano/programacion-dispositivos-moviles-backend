import { IsEmail, IsIn, IsString } from 'class-validator';
import { UserRole } from 'src/utils/user-role';

export class UpdateRoleDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsIn([UserRole.SECRETARY, UserRole.THERAPIST])
  role!: UserRole;
}
