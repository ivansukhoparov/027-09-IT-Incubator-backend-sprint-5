import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from './features/users/users.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { SecurityModule } from './features/security/security.module';
import { TestingModule } from './features/testing/testing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './settings/app.settings';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailMessagesManager } from './common/email/email.messages.manager';
import { NodemailerAdapter } from './common/adapters/nodemailer.adaper';
import { EmailService } from './common/email/email.service';
import { JwtTokenAdapter } from './common/adapters/jwt.token.adapter';
import { BcryptAdapter } from './common/adapters/bcrypt.adapter';
import { IsBlogExistConstraint } from './infrastructure/decorators/validate/is.blog.exist';

const mongoModule = MongooseModule.forRoot(
  appSettings.api.MONGO_CONNECTION_URI + '/' + appSettings.api.MONGO_DB_NAME,
);

const throttleModule = ThrottlerModule.forRoot([
  {
    ttl: 10000,
    limit: 5,
  },
]);

const typeOrmModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sa',
  database: 'bloggers',
  autoLoadEntities: false,
  synchronize: false,
});

const appModules = [UsersModule, BlogsModule, SecurityModule, TestingModule];

@Module({
  imports: [throttleModule, mongoModule, typeOrmModule, ...appModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
