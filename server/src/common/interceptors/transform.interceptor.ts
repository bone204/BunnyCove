import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseCodes } from '../constants/response-codes.js';

export interface StandardSuccessResponse<T> {
  success: true;
  code: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardSuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardSuccessResponse<T>> {
    return next.handle().pipe(
      map((result) => {
        // If result already formatted with success and code, pass through
        if (result && typeof result === 'object' && 'success' in result && 'code' in result) {
          return result;
        }

        return {
          success: true,
          code: ResponseCodes.SUCCESS,
          data: result !== undefined ? result : null,
        };
      }),
    );
  }
}
