import { WithId } from 'mongodb';
import { PostLikeDto, PostOutputDto, PostType } from './output';
import { LikeStatusType } from '../../likes/types/input';

export const postMapper = (post: WithId<PostType>, likes: PostsLikesInfoType): PostOutputDto => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: likes,
  };
};

export const postLikesMapper = (like: WithId<PostLikeDto>): NewestLikeType => {
  return {
    addedAt: like.addedAt,
    userId: like.likedUserId,
    login: like.likedUserName,
  };
};

export type NewestLikeType = {
  addedAt: string;
  userId: string;
  login: string;
};

export type PostsLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusType;
  newestLikes: Array<NewestLikeType>;
};
