import { IsString } from 'class-validator';

export class JoinComunityDto {
  @IsString()
  communityId: string;

  // Some payment stuff here
}
