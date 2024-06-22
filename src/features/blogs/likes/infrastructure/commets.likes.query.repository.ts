import { LikesInfoType } from '../../comments/types/output';
import { LikeStatusType } from '../types/input';
import { InjectModel } from '@nestjs/mongoose';
import { CommentLikes } from './likes.schema';
import { Model } from 'mongoose';

export class CommentsLikesQueryRepository {
  constructor(
    @InjectModel(CommentLikes.name)
    private commentLikesModel: Model<CommentLikes>,
  ) {}

  async getLikes(commentId: string, userId?: string): Promise<LikesInfoType> {
    let likeStatus: LikeStatusType = 'None';

    if (userId) {
      const userLike = await this.commentLikesModel.findOne({ $and: [{ commentId: commentId }, { likeOwnerId: userId }] }).lean();
      if (userLike) {
        likeStatus = userLike.status;
      }
    }

    const likesCount = await this.commentLikesModel.countDocuments({
      $and: [{ commentId: commentId }, { status: 'Like' }],
    });
    const dislikesCount = await this.commentLikesModel.countDocuments({
      $and: [{ commentId: commentId }, { status: 'Dislike' }],
    });
    return {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: likeStatus,
    };
  }
}
