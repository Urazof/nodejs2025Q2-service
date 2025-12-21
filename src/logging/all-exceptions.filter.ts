import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from './logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Определяем статус код и сообщение
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errorDetails = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // Для неожиданных ошибок мы не отправляем сообщение об ошибке клиенту,
      // но сохраняем его для логирования
      errorDetails = {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      };
    }

    // Логируем ошибку
    this.loggingService.error(
      {
        statusCode: status,
        message: exception instanceof Error ? exception.message : message,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        details: errorDetails,
      },
      exception instanceof Error ? exception.stack : undefined,
      'ExceptionFilter',
    );

    // Формируем ответ
    const errorResponse = {
      statusCode: status,
      message:
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal server error'
          : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
