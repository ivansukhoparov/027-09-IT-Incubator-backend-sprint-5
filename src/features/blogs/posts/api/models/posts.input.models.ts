import { IsMongoId, IsString, Length } from 'class-validator';
import { IsStringLength } from '../../../../../infrastructure/decorators/validate/is.string.length';
import { IsBlogExist } from '../../../../../infrastructure/decorators/validate/is.blog.exist';

export class CreatePostInputModel {
  @IsStringLength(0, 30)
  title: string;

  @IsStringLength(0, 100)
  shortDescription: string;

  @IsStringLength(0, 1000)
  content: string;

  @IsBlogExist({ message: 'Blog doesnt  exists' })
  @IsString()
  blogId: string;
}

export class CreatePostInputModelByBlog {
  @IsStringLength(0, 30)
  title: string;

  @IsStringLength(0, 100)
  shortDescription: string;

  @IsStringLength(0, 1000)
  content: string;
}

export class UpdatePostInputModel {
  @IsStringLength(0, 30)
  title: string;

  @IsStringLength(0, 100)
  shortDescription: string;

  @IsStringLength(0, 1000)
  content: string;
}
