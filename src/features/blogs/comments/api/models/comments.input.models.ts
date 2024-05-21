import { IsStringLength } from '../../../../../infrastructure/decorators/validate/is.string.length';

export class CommentCreateInputModel {
  @IsStringLength(20, 300)
  content: string;
}

export class UpdateCommentInputModel extends CommentCreateInputModel {
  @IsStringLength(20, 300)
  content: string;
}
