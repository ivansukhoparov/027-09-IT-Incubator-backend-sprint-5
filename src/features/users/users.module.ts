import { Module } from '@nestjs/common';
import { AdminUsersController } from './api/admin/admin.users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { CreateUserUseCase } from './use.cases/create.user.use.case';
import { DeleteUserUseCase } from './use.cases/delete.user.use.case';
import { GetAllUsersUseCase } from './use.cases/get.all.users.use.case';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastructure/users.schema';
import { BcryptAdapter } from '../../common/adapters/bcrypt.adapter';
import { CqrsModule } from '@nestjs/cqrs';

const useCases = [CreateUserUseCase, DeleteUserUseCase];

const queryCases = [GetAllUsersUseCase];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AdminUsersController],
  providers: [
    BcryptAdapter,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    ...useCases,
    ...queryCases,
  ],
  exports: [UsersService, UsersQueryRepository, BcryptAdapter],
})
export class UsersModule {}
