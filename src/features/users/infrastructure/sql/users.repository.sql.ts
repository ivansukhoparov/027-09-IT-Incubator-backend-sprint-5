import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users.schema';
import { ObjectId } from 'mongodb';
import { UserUpdateDto } from '../../types/input';
import { CreateUserDto } from '../../types/output';
import { IUsersRepository } from '../interfaces/users.repository.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersRepositorySql implements IUsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser(newUserDto: CreateUserDto | User): Promise<string> {
    try {
      const result = await this.dataSource.query(`
            INSERT INTO "Users"
            ("login","email","hash","isConfirmed")
            values('${newUserDto.login}','${newUserDto.email}','${newUserDto.hash}','${newUserDto.isConfirmed}')
            RETURNING id
        `);
      console.log('result ', result[0].id);
      return result[0].id;
    } catch {
      throw new NotFoundException();
    }
  }

  async getUserById(id: string) {
    try {
      return await this.dataSource.query(`
            SELECT * FROM "Users"
            WHERE "id" = '${id}'
        `);
    } catch {
      throw new NotFoundException();
    }
  }

  async getUserByLoginOrEmail(loginOrEmail: string) {
    try {
      return await this.dataSource.query(`
            SELECT * FROM "Users"
            WHERE ("login" = '${loginOrEmail}') OR ("email" = '${loginOrEmail}')
        `);
    } catch {
      throw new NotFoundException();
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.dataSource.query(`
            DELETE * FROM "Users"
            WHERE "id" = '${id}'
        `);
    } catch {
      throw new NotFoundException();
    }
  }

  async updateUser(id: string, userUpdateDto: UserUpdateDto): Promise<boolean> {
    try {
      const setData = Object.keys(userUpdateDto)
        .map((key: any) => {
          return `"${key}"='${userUpdateDto[key]}'`;
        })
        .join();

      const result = await this.dataSource.query(
        `
            UPDATE "Users"
            SET ${setData}
            WHERE "id" = $1
        `,
        [id],
      );
      console.log(result);
      return !!result[1];
    } catch (err) {
      console.log(err);
      throw new NotFoundException();
    }
  }

  async getMany(searchKey: any, sortKey: any, skipped: number, pageSize: number) {}

  async countOfDocuments(searchKey: any) {
    return 0;
  }
}
