import { QueryRequestType, QuerySortType, SearchType } from '../../common/types';
import { userMapper } from '../types/mapper';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';

export class GetAllUsersQuery {
  public searchData: SearchType = {};
  public sortData: QuerySortType;

  constructor(query: QueryRequestType) {
    this.sortData = {
      sortBy: query.sortBy ? query.sortBy : 'createdAt',
      sortDirection: query.sortDirection ? query.sortDirection : 'desc',
      pageNumber: query.pageNumber ? query.pageNumber : 1,
      pageSize: query.pageSize ? query.pageSize : 10,
    };

    if (query.searchLoginTerm) this.searchData.login = query.searchLoginTerm;
    if (query.searchEmailTerm) this.searchData.email = query.searchEmailTerm;
    if (query.searchNameTerm) this.searchData.name = query.searchNameTerm;
  }
}

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersUseCase implements IQueryHandler<GetAllUsersQuery> {
  constructor(protected usersQueryRepository: UsersQueryRepository) {}

  async execute(query: GetAllUsersQuery) {
    // const searchKey = {};

    // check have search terms create search keys array
    // const searchKeysArray: any[] = [];
    // if (query.searchData.login)
    //   searchKeysArray.push({
    //     login: { $regex: query.searchData.login, $options: 'i' },
    //   });
    // if (query.searchData.email)
    //   searchKeysArray.push({
    //     email: { $regex: query.searchData.email, $options: 'i' },
    //   });
    //
    // if (searchKeysArray.length === 0) {
    //   searchKey = {};
    // } else if (searchKeysArray.length === 1) {
    //   searchKey = searchKeysArray[0];
    // } else if (searchKeysArray.length > 1) {
    //   searchKey = { $or: searchKeysArray };
    // }
    // calculate limits for DB request
    const documentsTotalCount = await this.usersQueryRepository.countOfDocuments(query.searchData); // Receive total count of blogs
    const pageCount = Math.ceil(documentsTotalCount / +query.sortData.pageSize); // Calculate total pages count according to page size
    const skippedDocuments = (+query.sortData.pageNumber - 1) * +query.sortData.pageSize; // Calculate count of skipped docs before requested page

    // Get documents from DB
    const users = await this.usersQueryRepository.getMany(query.searchData, query.sortData, +skippedDocuments, +query.sortData.pageSize);

    return {
      pagesCount: pageCount,
      page: +query.sortData.pageNumber,
      pageSize: +query.sortData.pageSize,
      totalCount: documentsTotalCount,
      items: users.map(userMapper),
    };
  }
}
