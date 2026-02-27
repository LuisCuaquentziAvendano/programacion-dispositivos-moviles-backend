import { User } from '@prisma/client';

export class UserDto {
  email: string;
  name: string;
  role: string;
}

export function formatUser(user: User): UserDto {
  return {
    email: user.email,
    name: user.name,
    role: user.role || 'none',
  };
}
