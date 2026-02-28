import { User } from '@prisma/client';

export class UserDto {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function formatUser(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'none',
  };
}
