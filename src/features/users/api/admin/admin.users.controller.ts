import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { QueryUsersRequestType } from '../../types/input';
import { UserCreateInputModel } from './models/user.create.input.model';
import { AdminAuthGuard } from '../../../../infrastructure/guards/admin-auth-guard.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../use.cases/create.user.use.case';
import { DeleteUserCommand } from '../../use.cases/delete.user.use.case';
import { GetAllUsersQuery } from '../../use.cases/get.all.users.use.case';
import { UsersQueryRepository } from '../../infrastructure/users.query.repository';
import { UsersRepository } from '../../infrastructure/users.repository';

@Controller('sa/users')
export class AdminUsersController {
  constructor(
    protected commandBus: CommandBus,
    protected queryBus: QueryBus,
    protected usersQueryRepository: UsersQueryRepository,
    protected userRepo: UsersRepository,
  ) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  async getAll(@Query() query: QueryUsersRequestType) {
    // const { sortData, searchData } = createQueryS(query);
    // return await this.usersQueryRepository.getAllUsers(sortData, searchData);
    return await this.queryBus.execute<GetAllUsersQuery>(new GetAllUsersQuery(query));
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  async getById(@Param('id') id: string) {
    return await this.usersQueryRepository.getById(id);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createNew(@Body() inputModel: UserCreateInputModel) {
    //   const newUserId = await this.userService.create(inputModel);
    const createdUserId = await this.commandBus.execute<CreateUserCommand, string>(new CreateUserCommand(inputModel));
    return await this.usersQueryRepository.getById(createdUserId);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id') id: string) {
    // await this.userService.delete(id);
    await this.commandBus.execute<DeleteUserCommand, string>(new DeleteUserCommand(id));
    return;
  }

  @Put(':id')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUser(@Param('id') id: string) {
    // await this.userService.delete(id);
    await this.userRepo.updateUser(id, { login: 'newLogin' });
    return;
  }
}
