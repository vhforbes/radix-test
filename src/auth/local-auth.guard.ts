import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 1. Invokes the local strategy
// 2. Local strategy calls the verify method
// 3. It verifies the user in the DB and attaches it to the req or 401
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
