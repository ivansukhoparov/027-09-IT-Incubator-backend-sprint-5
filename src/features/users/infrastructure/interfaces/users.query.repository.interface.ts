import { UserOutputDto, UserOutputMeType } from '../../types/output';

export interface IUsersQueryRepository {
  getById(id: string): Promise<UserOutputDto>;

  getUserAuthMe(id: string): Promise<UserOutputMeType>;

  getMany(
    searchKey: any,
    sortKey: any,
    skipped: number,
    pageSize: number,
  ): Promise<any>;

  countOfDocuments(searchKey: any): Promise<number>;
}
