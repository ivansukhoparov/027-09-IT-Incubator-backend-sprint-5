export type CreateCommentDto = {
  content: string;
};

export type CommentCreateDto = {
  content: string;
  postId: string;
  userId: string;
  userLogin: string;
};

export type UpdateCommentDto = {
  content: string;
};

export type SortCommentsType = {
  sortBy: string;
  sortDirection: -1 | 1;
  pageNumber: number;
  pageSize: number;
};
