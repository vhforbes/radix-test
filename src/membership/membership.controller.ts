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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('membership')
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('join')
  @UseGuards(JwtAuthGuard)
  becomeMemberOfComunity(
    @Request() req,
    @Body() joinCommuityDto: JoinComunityDto,
  ) {
    // Will I validate the payment here in membership or have a separate Moule?

    // Ill need to have the payment logic setup to approve members

    //  Maybe the same it looks like I'm separating way too much early on...

    return 'Join community TBI';
  }
}
