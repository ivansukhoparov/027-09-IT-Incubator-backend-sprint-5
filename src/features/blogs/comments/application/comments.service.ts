import { CommentsRepository } from '../infrastructure/comments.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCommentInputModel } from '../api/models/comments.input.models';
import { CommentCreateDto } from '../types/input';
import { Comments } from '../infrastructure/comments.schema';
import { PostsService } from '../../posts/application/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected postService: PostsService,
  ) {}

  async getCommentById(id: string) {
    try {
      return await this.commentsRepository.getCommentById(id);
    } catch {
      throw new NotFoundException();
    }
  }

  async createComment(createDto: CommentCreateDto): Promise<string> {
    try {
      const createdAt = new Date();

      await this.postService.findById(createDto.postId);

      const commentCreateModel: Comments = {
        content: createDto.content,
        postId: createDto.postId,
        commentatorInfo: {
          userId: createDto.userId,
          userLogin: createDto.userLogin,
        },
        createdAt: createdAt.toISOString(),
      };
      return await this.commentsRepository.createComment(commentCreateModel);
    } catch {
      throw new NotFoundException();
    }
  }
  async updateComment(id: string, updateModel: UpdateCommentInputModel) {
    try {
      const comment = await this.commentsRepository.updateComment(id, updateModel);
    } catch {
      throw new NotFoundException();
    }
  }

  async deleteComment(id: string) {
    try {
      await this.commentsRepository.deleteComment(id);
      return true;
    } catch {
      throw new NotFoundException();
    }
  }

  async isCommentExist(id: string) {
    return await this.commentsRepository.isCommentExist(id);
  }
}
