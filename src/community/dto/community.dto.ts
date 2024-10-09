import { UnsensitiveUserDto } from '@src/user/dtos/unsensitive-user.dto';

export class CommunityDto {
  id: string;
  owner: UnsensitiveUserDto;
}
