import { LoggingService } from './logging.service';
import { Controller, Get, Injectable } from '@nestjs/common';

/**
 * Примеры использования LoggingService
 */

// 1. В контроллере
@Controller('example')
export class ExampleController {
  constructor(private readonly logger: LoggingService) {}

  @Get()
  findAll() {
    // Обычное логирование
    this.logger.log('Finding all items', 'ExampleController');

    // Логирование с объектом
    this.logger.log({ action: 'findAll', count: 10 }, 'ExampleController');

    // Отладочное логирование
    this.logger.debug('Debug info', 'ExampleController');

    // Предупреждение
    this.logger.warn('Warning message', 'ExampleController');

    return [];
  }
}

// 2. В сервисе
@Injectable()
export class ExampleService {
  constructor(private readonly logger: LoggingService) {}

  async processData(data: any) {
    try {
      this.logger.log('Processing data', 'ExampleService');

      // Ваша бизнес-логика
      const result = await this.someOperation(data);

      this.logger.log('Data processed successfully', 'ExampleService');
      return result;
    } catch (error) {
      // Логирование ошибки с stack trace
      this.logger.error(
        'Failed to process data',
        error.stack,
        'ExampleService',
      );
      throw error;
    }
  }

  private async someOperation(data: any) {
    // Детальное логирование
    this.logger.verbose('Detailed operation info', 'ExampleService');
    return data;
  }
}

// 3. Различные уровни логирования
export class LoggingExamples {
  constructor(private readonly logger: LoggingService) {}

  demonstrateLevels() {
    // ERROR - критические ошибки (всегда логируются)
    this.logger.error('Critical error occurred', 'stackTrace', 'Context');

    // WARN - предупреждения
    this.logger.warn('This is a warning', 'Context');

    // LOG - обычная информация (аналог INFO)
    this.logger.log('Normal information', 'Context');

    // DEBUG - отладочная информация
    this.logger.debug('Debug details', 'Context');

    // VERBOSE - детальная информация
    this.logger.verbose('Very detailed information', 'Context');
  }
}

/**
 * Конфигурация уровней логирования:
 *
 * LOG_LEVEL=error   -> Только ERROR
 * LOG_LEVEL=warn    -> WARN + ERROR
 * LOG_LEVEL=log     -> LOG + WARN + ERROR (по умолчанию)
 * LOG_LEVEL=debug   -> DEBUG + LOG + WARN + ERROR
 * LOG_LEVEL=verbose -> VERBOSE + DEBUG + LOG + WARN + ERROR (всё)
 */
