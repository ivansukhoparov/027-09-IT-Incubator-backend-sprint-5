import { User } from '../users.schema';
import { CreateUserDto } from '../../types/output';
import { UserUpdateDto } from '../../types/input';

export interface IUsersRepository {
  createUser(newUserDto: CreateUserDto | User): Promise<string>;

  getUserById(id: string): Promise<any>;

  getUserByLoginOrEmail(loginOrEmail: string): Promise<any>;

  deleteUser(id: string): Promise<void>;

  updateUser(id: string, userUpdateDto: UserUpdateDto): Promise<boolean>;
}
