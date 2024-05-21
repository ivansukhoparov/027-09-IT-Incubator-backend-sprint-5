import { LikeStatusType } from '../../types/input';

export class BaseOutputLikesModel {}

export class CommentsLikesOutputModel extends BaseOutputLikesModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusType;
}

export class PostsLikesOutputModel extends BaseOutputLikesModel {}
