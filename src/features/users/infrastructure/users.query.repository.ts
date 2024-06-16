import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IUsersQueryRepository } from './interfaces/users.query.repository.interface';
import { UserOutputMeType } from '../types/output';
import { QuerySortType, SearchType } from '../../common/types';
import { UserOutputModel } from '../api/admin/models/user.ouput.model';

@Injectable()
export class UsersQueryRepository implements IUsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getById(id: string): Promise<UserOutputModel> {
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
        searchString = ``;
      }
      const orderString = `"` + sortKey.sortBy + `" ` + sortKey.sortDirection;
      const result = await this.dataSource.query(
        `
             SELECT "id", "login", "email","createdAt" FROM "Users"
               ${searchString}
             ORDER BY ${orderString}
             LIMIT ${pageSize} OFFSET ${skipped}

             `,

        // `
        //                  SELECT "id", "login", "email","createdAt" FROM "Users"
        //                   $1
        //                  ORDER BY $2
        //                  LIMIT $3 OFFSET $4
        //                  `,
        // [searchString, orderString, pageSize, skipped],
      );
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
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
