import { CommentOutputDto, CommentType, LikesInfoType } from './output';
import { CommentDocument } from '../infrastructure/comments.schema';

export const commentMapper = (input: CommentDocument, likes: LikesInfoType): CommentOutputDto => {
  return {
    id: input._id.toString(),
    content: input.content,
    commentatorInfo: {
      userId: input.commentatorInfo.userId,
      userLogin: input.commentatorInfo.userLogin,
    },
    createdAt: input.createdAt,
    likesInfo: { ...likes },
  };
};
