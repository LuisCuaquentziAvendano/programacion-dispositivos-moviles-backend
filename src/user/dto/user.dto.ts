import { User } from '@prisma/client';

export class UserDto {
  id!: number;
  uid!: string;
  email!: string | null;
  name!: string | null;
  phoneNumber!: string | null;
  role!: string;
}

export function formatUser(user: User): UserDto {
  return {
    id: user.id,
    uid: user.uid,
    email: user.email,
    name: user.name,
    phoneNumber: user.phoneNumber,
    role: user.role || 'none',
  };
}
