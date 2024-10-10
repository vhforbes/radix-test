import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { JoinComunityDto } from './dtos/join-community.dto';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('join')
  @UseGuards(JwtAuthGuard)
  becomeMember(@Request() req, @Body() joinCommuityDto: JoinComunityDto) {
    // Will I validate the payment here in membership or have a separate Moule?

    //  Maybe the same it looks like I'm separating way too much early on...

    return 'Join community TBI';
  }
}
