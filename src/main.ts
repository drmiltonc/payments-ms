import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import envVars from './config/envs';

async function bootstrap() {

  const logger = new Logger('Payments-Ms');

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,



  }));

  await app.listen(envVars.PORT);
  logger.log(`Payments-Ms is running in port ${envVars.PORT}`);
}
bootstrap();
