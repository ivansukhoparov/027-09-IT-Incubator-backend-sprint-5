import { Injectable } from '@nestjs/common';
import { UserType } from '../types/output';
import { BcryptAdapter } from '../../../common/adapters/bcrypt.adapter';
import { UserCreateInputModel } from '../api/admin/models/user.create.input.model';
import { UsersRepository } from '../infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptAdapter: BcryptAdapter,
  ) {}

  async create(inputModel: UserCreateInputModel, isConfirmed: boolean = false) {
    const createdAt = new Date().toISOString();
    const hash = await this.cryptAdapter.createHash(inputModel.password);

    const newUser: UserType = {
      login: inputModel.login,
      email: inputModel.email,
      hash: hash,
      createdAt: createdAt,
      isConfirmed: isConfirmed,
    };

    return await this.usersRepository.createUser(newUser);
  }

  async getUserByLoginOrEmail(loginOrEmail: string) {
    return this.usersRepository.getUserByLoginOrEmail(loginOrEmail);
  }

  async getUserById(id: string) {
    return this.usersRepository.getUserById(id);
  }

  async updateUserConfirmationStatus(id: string) {
    const userUpdateDto = { isConfirmed: true };
    const result = await this.usersRepository.updateUser(id, userUpdateDto);
    return result;
  }

  async delete(id: string) {
    await this.usersRepository.deleteUser(id);
  }
}
