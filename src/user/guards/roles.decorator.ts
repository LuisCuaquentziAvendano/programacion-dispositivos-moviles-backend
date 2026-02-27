import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/utils/user-role';

export const ROLES_KEY = 'roles';
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
