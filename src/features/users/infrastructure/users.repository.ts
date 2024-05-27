import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { CreateUserDto } from '../types/output';
import { User } from './users.schema';
import { UserUpdateDto } from '../types/input';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createUser(newUserDto: CreateUserDto | User): Promise<string> {
    try {
      const result = await this.dataSource.query(
        `
            INSERT INTO "Users"
            ("login","email","hash","isConfirmed")
            values($1,$2,$3,$4)
            RETURNING id
        `,
        [
          newUserDto.login,
          newUserDto.email,
          newUserDto.hash,
          newUserDto.isConfirmed,
        ],
      );
      return result[0].id;
    } catch {
      throw new NotFoundException();
    }
  }

  async getUserById(id: string) {
    try {
      const result = await this.dataSource.query(
        `
            SELECT * FROM "Users"
                WHERE "id" = $1
        `,
        [id],
      );

      return result[0];
    } catch {
      throw new NotFoundException();
    }
  }

  async getUserByLoginOrEmail(loginOrEmail: string) {
    try {
      const result = await this.dataSource.query(
        `SELECT * FROM "Users"
               WHERE "login" = '${loginOrEmail}' OR "email" = '${loginOrEmail}'`,
      );
      return result[0];
    } catch {
      throw new NotFoundException();
    }
  }

  async deleteUser(id: string) {
    try {
      const result = await this.dataSource.query(
        `DELETE FROM "Users"
             WHERE "id" = $1 `,
        [id],
      );
      if (result[1] === 0) {
        throw new NotFoundException();
      }
      return;
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
      return !!result[1];
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
