import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';

/**
 * Перехватчик для логирования HTTP запросов
 * Логирует входящие запросы и исходящие ответы с временем выполнения
 */
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  /**
   * Перехватывает HTTP запросы для логирования
   * @param context - контекст выполнения
   * @param next - обработчик следующего шага
   * @returns Observable с логированием
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Извлекаем данные запроса
    const { method, url, query, body } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          const responseTime = Date.now() - startTime;

          // Логируем успешный запрос
          this.loggingService.logHttpRequest(
            method,
            url,
            query,
            body,
            statusCode,
            `HTTP - ${responseTime}ms`,
          );
        },
        error: (error) => {
          const statusCode = error?.status || 500;
          const responseTime = Date.now() - startTime;

          // Логируем ошибку запроса
          this.loggingService.logHttpRequest(
            method,
            url,
            query,
            body,
            statusCode,
            `HTTP ERROR - ${responseTime}ms`,
          );
        },
      }),
    );
  }
}
