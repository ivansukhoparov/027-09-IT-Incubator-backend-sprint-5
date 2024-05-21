import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikeStatusType } from '../types/input';

export type CommentLikesDocument = HydratedDocument<CommentLikes>;
export type PostsLikesDocument = HydratedDocument<PostsLikes>;

@Schema()
export class CommentLikes {
  @Prop()
  commentId: string;

  @Prop()
  likeOwnerId: string;

  @Prop()
  status: LikeStatusType;
}

@Schema()
export class PostsLikes {
  @Prop()
  postId: string;

  @Prop()
  likeOwnerId: string;

  @Prop()
  likeOwnerName: string;

  @Prop()
  addedAt: string;

  @Prop()
  status: LikeStatusType;
}

export const CommentLikesSchema = SchemaFactory.createForClass(CommentLikes);
export const PostsLikesSchema = SchemaFactory.createForClass(PostsLikes);
