import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggingService } from './logging/logging.service';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggingService = app.get(LoggingService);
  app.useLogger(loggingService);

  // Global handlers for uncaught exceptions and unhandled rejections
  process.on('uncaughtException', (err) => {
    loggingService.error(`Uncaught Exception: ${err.message}`, err.stack);
    // Optional: process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    loggingService.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = process.env.PORT || 4000;
  await app.listen(port);

  loggingService.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
