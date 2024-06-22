import { Injectable } from '@nestjs/common';
import { CommentsLikesRepository } from '../infrastructure/comments.likes.repository';
import { CommentLikes } from '../infrastructure/likes.schema';
import { CommentsLikesInputModel } from '../api/models/likes.input.models';

@Injectable()
export class CommentsLikesService {
  constructor(protected commentsLikesRepository: CommentsLikesRepository) {}

  async updateLike(userId: string, commentId: string, inputModel: CommentsLikesInputModel) {
    const updateModel: CommentLikes = {
      commentId: commentId,
      likeOwnerId: userId,
      status: inputModel.likeStatus,
    };
    await this.commentsLikesRepository.update(updateModel);
  }
}
