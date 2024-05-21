export type QueryUsersRequestType = {
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
};

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
