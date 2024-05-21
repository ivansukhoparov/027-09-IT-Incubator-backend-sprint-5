export type BlogCreateDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogUpdateDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type QueryBlogRequestType = {
  searchNameTerm?: string | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: number;
  pageSize?: number;
};

export type SortBlogRepositoryType = {
  sortBy: string;
  sortDirection: 1 | -1;
  pageNumber: number;
  pageSize: number;
};

export type SearchBlogRepositoryType = {
  searchNameTerm: string | null;
};
