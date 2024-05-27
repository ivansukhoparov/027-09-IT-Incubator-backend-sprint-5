import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { SecurityModule } from './features/security/security.module';
import { TestingModule } from './features/testing/testing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './settings/app.settings';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

const mongoModule = MongooseModule.forRoot(
  appSettings.api.MONGO_CONNECTION_URI + '/' + appSettings.api.MONGO_DB_NAME,
);

const throttleModule = ThrottlerModule.forRoot([
  {
    ttl: 100000,
    limit: 5000,
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
