import {
  QueryDto,
  QueryRequestType,
  QuerySearchType,
  QuerySortType,
  SearchType,
} from './types';

export const createQuery = (query: QueryRequestType): QueryDto => {
  const searchData: QuerySearchType = {};
  const sortData: QuerySortType = {
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection : 'desc',
    pageNumber: query.pageNumber ? query.pageNumber : 1,
    pageSize: query.pageSize ? query.pageSize : 10,
  };

  if (query.searchLoginTerm) searchData.searchLoginTerm = query.searchLoginTerm;
  if (query.searchEmailTerm) searchData.searchEmailTerm = query.searchEmailTerm;
  if (query.searchNameTerm) searchData.searchNameTerm = query.searchNameTerm;

  return { sortData, searchData };
};

export const createQueryS = (query: QueryRequestType) => {
  const searchData: SearchType = {};
  const sortData: QuerySortType = {
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection : 'desc',
    pageNumber: query.pageNumber ? query.pageNumber : 1,
    pageSize: query.pageSize ? query.pageSize : 10,
  };

  if (query.searchLoginTerm) searchData.login = query.searchLoginTerm;
  if (query.searchEmailTerm) searchData.email = query.searchEmailTerm;
  if (query.searchNameTerm) searchData.name = query.searchNameTerm;

  return { sortData, searchData };
};
