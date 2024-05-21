import { Schema } from '@nestjs/mongoose';
import { PostsLikesInfoType } from './mapper';
import { LikeStatusType } from '../../likes/types/input';

export class PostOutputDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: PostsLikesInfoType;
}

@Schema()
export class PostType {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}

export type PostLikeDto = {
  postId: string;
  likedUserId: string;
  likedUserName: string;
  addedAt: string;
  status: LikeStatusType;
};
