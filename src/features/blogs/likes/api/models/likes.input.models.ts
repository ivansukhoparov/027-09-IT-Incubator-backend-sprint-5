import { LikeStatusType } from '../../types/input';
import { IsIn } from 'class-validator';

export class BaseInputLikesModel {
  @IsIn(['None', 'Like', 'Dislike'])
  likeStatus: LikeStatusType;
}

export class CommentsLikesInputModel {
  @IsIn(['None', 'Like', 'Dislike'])
  likeStatus: LikeStatusType;
}

export class PostsLikesInputModel {
  @IsIn(['None', 'Like', 'Dislike'])
  likeStatus: LikeStatusType;
}
