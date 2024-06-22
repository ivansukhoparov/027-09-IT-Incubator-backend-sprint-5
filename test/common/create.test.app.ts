import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../../src/infrastructure/exception-filters/http.exception.filter';
import { MockEmailService } from '../utils/mocks/EmaiServiceMock';
import { EmailService } from '../../src/common/email/email.service';

export const creteTestApp = async () => {
  const testingAppModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });
  // .overrideProvider(EmailService)
  // .useClass(MockEmailService);

  const testingAppModule = await testingAppModuleBuilder.compile();

  const app: INestApplication = testingAppModule.createNestApplication();
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
  await app.init();

  return app;
};
