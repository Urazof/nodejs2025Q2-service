import { Injectable, LogLevel, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type LogLevelString = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logToFile: boolean;
  private logFilePath: string;
  private maxFileSize: number;
  private currentLogLevel: LogLevel[];

  constructor() {
    super('App');

    // Чтение конфигурации из переменных окружения
    this.logToFile = process.env.LOG_TO_FILE === 'true';
    this.logFilePath = process.env.LOG_FILE_PATH || 'logs/app.log';

    // Размер файла в кБ из переменной окружения, по умолчанию 10MB (10240 кБ)
    const maxFileSizeKb = parseInt(
      process.env.LOG_MAX_FILE_SIZE || '10240',
      10,
    );
    this.maxFileSize = maxFileSizeKb * 1024; // Перевод в байты

    // Установка уровня логирования из переменной окружения
    const envLogLevel = (process.env.LOG_LEVEL || 'log').toLowerCase();
    this.currentLogLevel = this.getLogLevels(envLogLevel);

    // Создание директории для логов, если она не существует
    if (this.logToFile) {
      this.ensureLogDirectory();
    }
  }

  /**
   * Определяет, какие уровни логирования должны быть активны
   * на основе указанного минимального уровня
   */
  private getLogLevels(level: string): LogLevel[] {
    const levels: Record<string, LogLevel[]> = {
      verbose: ['verbose', 'debug', 'log', 'warn', 'error'],
      debug: ['debug', 'log', 'warn', 'error'],
      log: ['log', 'warn', 'error'],
      warn: ['warn', 'error'],
      error: ['error'],
    };
    return levels[level] || levels['log'];
  }

  /**
   * Проверяет, должен ли логироваться указанный уровень
   */
  private shouldLog(level: LogLevel): boolean {
    return this.currentLogLevel.includes(level);
  }

  /**
   * Создает директорию для логов, если она не существует
   */
  private ensureLogDirectory(): void {
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Проверяет размер файла и выполняет ротацию при необходимости
   */
  private rotateLogFileIfNeeded(): void {
    if (!this.logToFile) return;

    try {
      if (fs.existsSync(this.logFilePath)) {
        const stats = fs.statSync(this.logFilePath);

        // Если размер файла превышает максимальный, выполняем ротацию
        if (stats.size >= this.maxFileSize) {
          const timestamp = new Date()
            .toISOString()
            .replace(/:/g, '-')
            .replace(/\..+/, '');
          const rotatedPath = this.logFilePath.replace(
            /\.log$/,
            `-${timestamp}.log`,
          );

          // Переименовываем текущий файл
          fs.renameSync(this.logFilePath, rotatedPath);

          // Создаем новый файл
          fs.writeFileSync(this.logFilePath, '');
        }
      }
    } catch (error) {
      // В случае ошибки ротации продолжаем работу без прерывания
      console.error('Error during log rotation:', error);
    }
  }

  /**
   * Записывает лог в файл
   */
  private writeToFile(message: string): void {
    if (!this.logToFile) return;

    try {
      this.rotateLogFileIfNeeded();
      fs.appendFileSync(this.logFilePath, message + '\n', 'utf8');
    } catch (error) {
      // В случае ошибки записи выводим в консоль
      console.error('Error writing to log file:', error);
    }
  }

  /**
   * Форматирует сообщение для логирования
   */
  private formatLogMessage(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const messageStr =
      typeof message === 'object' ? JSON.stringify(message) : message;
    const traceStr = trace ? `\n${trace}` : '';

    return `${timestamp} [${level.toUpperCase()}] ${contextStr} ${messageStr}${traceStr}`;
  }

  /**
   * Общий метод логирования
   */
  private writeLog(
    level: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatLogMessage(
      level,
      message,
      context,
      trace,
    );

    // Вывод в консоль (stdout)
    super[level](message, context);

    // Запись в файл
    this.writeToFile(formattedMessage);
  }

  /**
   * Логирование обычных сообщений (info level)
   */
  log(message: any, context?: string): void {
    this.writeLog('log', message, context);
  }

  /**
   * Логирование ошибок
   */
  error(message: any, trace?: string, context?: string): void {
    this.writeLog('error', message, context, trace);
  }

  /**
   * Логирование предупреждений
   */
  warn(message: any, context?: string): void {
    this.writeLog('warn', message, context);
  }

  /**
   * Логирование отладочной информации
   */
  debug(message: any, context?: string): void {
    this.writeLog('debug', message, context);
  }

  /**
   * Логирование детальной информации
   */
  verbose(message: any, context?: string): void {
    this.writeLog('verbose', message, context);
  }

  /**
   * Логирование HTTP запросов
   */
  logHttpRequest(
    method: string,
    url: string,
    query: any,
    body: any,
    statusCode: number,
    context = 'HTTP',
  ): void {
    const logData = {
      method,
      url,
      query,
      body,
      statusCode,
    };

    this.log(logData, context);
  }
}
