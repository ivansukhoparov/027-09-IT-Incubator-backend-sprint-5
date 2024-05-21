import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUsersQueryRepository } from './interfaces/users.query.repository.interface';
import { UserOutputDto, UserOutputMeType } from '../types/output';
import { QuerySortType, SearchType } from '../../common/types';

@Injectable()
export class UsersQueryRepository implements IUsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getById(id: string): Promise<UserOutputDto> {
    try {
      const result = await this.dataSource.query(
        `
             SELECT "id", "login", "email", "createdAt" FROM "Users"
             WHERE "id" =  $1`,
        [id],
      );
      return result[0];
    } catch {
      throw new NotFoundException();
    }
  }

  async getUserAuthMe(id: string): Promise<UserOutputMeType> {
    try {
      const result = await this.dataSource.query(
        `
             SELECT "id" AS "userId", "login", "email" FROM "Users"
             WHERE "id" =  $1`,
        [id],
      );
      return result[0];
    } catch {
      throw new NotFoundException();
    }
  }

  async getMany(
    searchKey: SearchType,
    sortKey: QuerySortType,
    skipped: number,
    pageSize: number,
  ) {
    try {
      let searchString: string = '';
      const searchArray = Object.keys(searchKey).map((key: any) => {
        return `"${key}" ~* '${searchKey[key]}'`;
      });
      if (searchArray.length > 0) {
        searchString = 'WHERE ' + searchArray.join(' OR ');
      } else {
        searchString = `--'`;
      }
      const orderString = `"` + sortKey.sortBy + `" ` + sortKey.sortDirection;
      const result = await this.dataSource.query(
        `
             SELECT "id", "login", "email","createdAt" FROM "Users"
               ${searchString}
             ORDER BY ${orderString}
             LIMIT ${pageSize} OFFSET ${skipped}
             `,
        //,        [searchString, orderString, pageSize, skipped],
      );
      return result;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async countOfDocuments(searchKey: SearchType) {
    try {
      let searchString: string = '';
      const searchArray = Object.keys(searchKey).map((key: any) => {
        return `"${key}" ~* '${searchKey[key]}'`;
      });
      if (searchArray.length > 0) {
        searchString = 'WHERE ' + searchArray.join(' OR ');
      } else {
        searchString = `--'`;
      }

      const query = `
        SELECT count (*)
        FROM "Users"
        ${searchString}
         `;

      const result = await this.dataSource.query(query);
      return +result[0].count;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
