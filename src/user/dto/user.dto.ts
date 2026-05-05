import { User } from '@prisma/client';

export class UserDto {
  id: number;
  email: string;
  name: string | null;
  phoneNumber: string | null;
  role: string;
}

export function formatUser(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phoneNumber: user.phoneNumber,
    role: user.role || 'none',
  };
}
