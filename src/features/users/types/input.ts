// export type QueryUsersRequestType = {
//   searchLoginTerm?: string | null;
//   searchEmailTerm?: string | null;
//   sortBy?: string;
//   sortDirection?: 'asc' | 'desc';
//   pageNumber?: number;
//   pageSize?: number;
// };

import { IsIn, IsNotEmpty, IsOptional, IsString, isString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export type SortUsersRepositoryType = {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
};
export type SearchUsersRepositoryType = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
};

export type UserUpdateDto = {
  login?: string;
  email?: string;
  hash?: string;
  createdAt?: string;
  isConfirmed?: boolean;
};

export class QueryUsersRequestType {
  @IsOptional()
  searchLoginTerm: string | null;
  @IsOptional()
  searchEmailTerm: string | null;

  // @IsOptional()
  // @Length(3, 55)
  // @IsIn(['createdAt', 'login'])

  @Transform(({ value }) => {
    const availableFields = ['createdAt', 'login'];
    const sortField = availableFields.find((el) => el === value);
    console.log('sortField', sortField);

    return sortField || 'createdAt';

    // else {
    //   return 'createdAt';
    // }
    // console.log(query.value);
    // if (['createdAt', 'login']) {
    //   console.log(true);
    //   return query.value;
    // }
    // return 'createdAt';
  })
  // @Transform(({ value }) => {
  //   console.log(value);
  //   return value || 'createdAt';
  // })
  sortBy: string;

  @IsIn(['asc', 'desc'])
  sortDirection: 'asc' | 'desc' = 'desc';
  @IsOptional()
  pageNumber: number;
  @IsOptional()
  pageSize: number;
}
