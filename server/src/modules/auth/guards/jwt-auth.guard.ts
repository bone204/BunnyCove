import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseCodes } from '../../../common/constants/response-codes.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException({
        code: ResponseCodes.UNAUTHORIZED,
        message: 'Invalid or expired access token',
      });
    }
    return user;
  }
}
