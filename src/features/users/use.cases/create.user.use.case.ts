import { CreateUserDto, UserType } from '../types/output';
import { BcryptAdapter } from '../../../common/adapters/bcrypt.adapter';
import { UserCreateInputModel } from '../api/admin/models/user.create.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../infrastructure/users.repository';

export class CreateUserCommand {
  login: string;
  password: string;
  email: string;
  isConfirmed: boolean = false;

  constructor(inputModel: UserCreateInputModel) {
    this.login = inputModel.login;
    this.password = inputModel.password;
    this.email = inputModel.email;
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptAdapter: BcryptAdapter,
  ) {}

  async execute(command: CreateUserCommand) {
    const hash = await this.cryptAdapter.createHash(command.password);

    const newUserDto: CreateUserDto = {
      login: command.login,
      email: command.email,
      hash: hash,
      //    createdAt: new Date().toISOString(),
      isConfirmed: command.isConfirmed,
    };

    return await this.usersRepository.createUser(newUserDto);
  }
}
