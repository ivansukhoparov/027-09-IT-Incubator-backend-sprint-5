import { Injectable } from '@nestjs/common';
import { CommentsLikesRepository } from '../infrastructure/comments.likes.repository';
import { PostsLikes } from '../infrastructure/likes.schema';
import { CommentsLikesInputModel } from '../api/models/likes.input.models';
import { PostsLikesRepository } from '../infrastructure/posts.likes.repository';
import { UsersService } from '../../../users/application/users.service';

@Injectable()
export class PostsLikesService {
  constructor(
    protected commentsLikesRepository: CommentsLikesRepository,
    protected postsLikesRepository: PostsLikesRepository,
    protected userService: UsersService,
  ) {}

  async updateLike(userId: string, postId: string, inputModel: CommentsLikesInputModel) {
    const createdAt = new Date();
    const user = await this.userService.getUserById(userId);

    const updateModel: PostsLikes = {
      postId: postId,
      likeOwnerId: userId,
      likeOwnerName: user.login,
      addedAt: createdAt.toISOString(),
      status: inputModel.likeStatus,
    };

    await this.postsLikesRepository.update(updateModel);
  }
}
