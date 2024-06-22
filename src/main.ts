import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorsExceptionFilter, HttpExceptionFilter } from './infrastructure/exception-filters/http.exception.filter';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory(validationErrors) {
        const errorMessages = { errorsMessages: [] };
        validationErrors.forEach((e) => {
          const constraintsKey = Object.keys(e.constraints);
          errorMessages.errorsMessages.push({
            message: e.constraints[constraintsKey[0]],
            field: e.property,
          });
        });
        throw new BadRequestException(errorMessages);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ErrorsExceptionFilter());
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
