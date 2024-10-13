import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '@src/common/roles.decorator';
import { MembershipService } from '../membership.service';
import { UserRole } from '@src/user/user-roles.enum';

@Injectable()
export class MembershipRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private membershipService: MembershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Gets roles set in the controller when injecting the Guard
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const communityId = request.params.id;

    return await this.membershipService.hasMembershipRole(
      communityId,
      user.email,
      roles,
    );
  }
}
