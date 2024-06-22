import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, Comments } from './comments.schema';
import { commentMapper } from '../types/mapper';
import { LikesInfoType, OutputCommentType } from '../types/output';
import { CommentsLikesQueryRepository } from '../../likes/infrastructure/commets.likes.query.repository';
import { PostsService } from '../../posts/application/posts.service';
import { QuerySortType, ViewModelType } from '../../../common/types';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comments.name) private commentModel: Model<Comments>,
    protected commentsLikesQueryRepository: CommentsLikesQueryRepository,
    protected postsService: PostsService,
  ) {}
  async getAllCommentsByPostId(sortData: QuerySortType, postId: string, userId?: string): Promise<ViewModelType<OutputCommentType> | null> {
    try {
      await this.postsService.findById(postId);

      const commentsCount = await this.commentModel.countDocuments({
        postId: postId,
      });
      const pagesCount = Math.ceil(commentsCount / sortData.pageSize);
      const skipComments = (sortData.pageNumber - 1) * sortData.pageSize;

      const comments: Array<CommentDocument> = await this.commentModel
        .find({ postId: postId })
        .sort({ [sortData.sortBy]: sortData.sortDirection })
        .skip(skipComments)
        .limit(sortData.pageSize)
        .lean();

      const mappedComments: OutputCommentType[] = [];

      for (let i = 0; i < comments.length; i++) {
        let likes: LikesInfoType;
        if (userId) likes = await this.commentsLikesQueryRepository.getLikes(comments[i]._id.toString(), userId);
        else likes = await this.commentsLikesQueryRepository.getLikes(comments[i]._id.toString());

        mappedComments.push(commentMapper(comments[i], likes));
      }

      return {
        pagesCount: pagesCount,
        page: +sortData.pageNumber,
        pageSize: +sortData.pageSize,
        totalCount: commentsCount,
        items: mappedComments,
      };
    } catch (err) {
      throw new NotFoundException();
    }
  }
  async getById(commentId: string, userId?: string) {
    try {
      let likes: LikesInfoType;
      const comment: CommentDocument = await this.commentModel.findById(commentId);
      if (userId) likes = await this.commentsLikesQueryRepository.getLikes(commentId, userId);
      else likes = await this.commentsLikesQueryRepository.getLikes(commentId);
      // const likes: LikesInfoType = {
      //     likesCount: 0,
      //     dislikesCount: 0,
      //     myStatus: "None"
      // }
      const result = commentMapper(comment, likes);
      if (comment) return result;
      else throw new NotFoundException();
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
