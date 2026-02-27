import { Organization, User } from '@prisma/client';
import { formatUser, UserDto } from 'src/user/dto/user.dto';

export class OrganizationDto {
  name: string;
  creator: UserDto;
}

export function formatOrganization(
  organization: Organization,
  creator: User,
): OrganizationDto {
  return {
    name: organization.name,
    creator: formatUser(creator),
  };
}
