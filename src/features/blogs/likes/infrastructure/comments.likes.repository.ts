import { ObjectId } from 'mongodb';
import { Comments } from '../../comments/infrastructure/comments.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentLikes } from './likes.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentsLikesRepository {
  constructor(
    @InjectModel(CommentLikes.name)
    private commentLikesModel: Model<CommentLikes>,
    @InjectModel(Comments.name) private commentModel: Model<Comments>,
  ) {}

  async update(updateModel: CommentLikes) {
    const comment = await this.commentModel.findOne({
      _id: new ObjectId(updateModel.commentId),
    });
    if (!comment) throw new NotFoundException();
    const like = await this.commentLikesModel.findOne({
      $and: [{ likeOwnerId: updateModel.likeOwnerId }, { commentId: updateModel.commentId }],
    });

    if (like) {
      like.status = updateModel.status;
      like.save();
    } else {
      await this.commentLikesModel.create(updateModel);
    }
  }
}
