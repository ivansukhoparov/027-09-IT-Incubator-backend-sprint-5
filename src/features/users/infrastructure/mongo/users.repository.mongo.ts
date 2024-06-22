import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users.schema';
import { ObjectId } from 'mongodb';
import { UserUpdateDto } from '../../types/input';
import { CreateUserDto } from '../../types/output';
import { IUsersRepository } from '../interfaces/users.repository.interface';

@Injectable()
export class UsersRepositoryMongo implements IUsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(newUserDto: CreateUserDto | User) {
    const newUser = { ...newUserDto, createdAt: new Date().toISOString() };
    const result = await this.userModel.create(newUser);
    return result._id.toString();
  }

  async getUserById(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch {
      throw new NotFoundException();
    }
  }

  async getUserByLoginOrEmail(loginOrEmail: string) {
    try {
      const searchKey = {
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      };
      const user = await this.userModel.findOne(searchKey);
      if (!user) return null;
      return user;
    } catch (err) {
      return null;
    }
  }

  async deleteUser(id: string) {
    try {
      const result = await this.userModel.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount !== 1) throw new NotFoundException();
    } catch {
      throw new NotFoundException();
    }
  }

  async updateUser(id: string, userUpdateDto: UserUpdateDto) {
    try {
      const isUpdate = await this.userModel.findOneAndUpdate({ _id: new ObjectId(id) }, userUpdateDto, { new: true });
      if (isUpdate) return true;
      else return false;
    } catch (err) {
      return false;
    }
  }

  async getMany(searchKey: any, sortKey: any, skipped: number, pageSize: number) {
    return this.userModel.find(searchKey).sort(sortKey).skip(skipped).limit(pageSize).lean();
  }

  async countOfDocuments(searchKey: any) {
    return this.userModel.countDocuments(searchKey);
  }
}
