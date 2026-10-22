import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseCodes } from '../constants/response-codes.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Skip if not HTTP (e.g. WebSocket context handled by gateway)
    if (!response || typeof response.status !== 'function') {
      this.logger.error(
        JSON.stringify({
          level: 'ERROR',
          message: 'Unhandled non-HTTP exception',
          error: exception instanceof Error ? exception.message : exception,
        }),
      );
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = ResponseCodes.SERVER_ERROR;
    let message = 'An unexpected internal server error occurred';
    let details: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const errorObj = res as Record<string, any>;
        message = errorObj.message || exception.message;
        if (errorObj.code) {
          code = errorObj.code;
        } else if (status === 404) {
          code = ResponseCodes.NOT_FOUND;
        } else if (status === 401) {
          code = ResponseCodes.UNAUTHORIZED;
        } else if (status === 403) {
          code = ResponseCodes.FORBIDDEN;
        } else if (status === 409) {
          code = ResponseCodes.EMAIL_ALREADY_EXISTS;
        } else if (status === 400) {
          code = ResponseCodes.VALIDATION_ERROR;
        } else {
          code = ResponseCodes.SERVER_ERROR;
        }
        details = errorObj.error || errorObj.details || null;
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        JSON.stringify({
          level: 'ERROR',
          message: exception.message,
          stack: exception.stack,
        }),
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        details,
      },
    });
  }
}
