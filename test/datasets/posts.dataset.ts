import { HttpStatus } from '@nestjs/common';
import { TestsDataset } from './dataset';

export class ViewModelResponse {
  static emptyBody = {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: [],
  };
}

export class PostsDataset extends TestsDataset {
  valid = {
    createModel: {
      title: 'Post_title_',
      shortDescription: 'a very short description',
      content: 'some content',
      blogId: '',
    },
    responseModel: {
      id: expect.any(String),
      title: 'Post_title_',
      shortDescription: 'a very short description',
      content: 'some content',
      blogId: expect.any(String),
      blogName: expect.any(String),
      createdAt: expect.any(String),
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: 'None',
        newestLikes: expect.any(Array),
      },
    },
    responseCode: HttpStatus.CREATED,
  };
  invalid = {
    empty: {
      createModel: {
        name: '',
        description: '',
        websiteUrl: '',
      },
      responseModel: this.errorsResponse(['name', 'description', 'websiteUrl']),
      responseCode: HttpStatus.BAD_REQUEST,
    },
    overlength: {
      createModel: {
        name: this.createOverLength(16),
        description: this.createOverLength(501),
        websiteUrl: 'http://www.' + this.createOverLength(100) + '.com',
      },
      responseModel: this.errorsResponse(['name', 'description', 'websiteUrl']),
      responseCode: HttpStatus.BAD_REQUEST,
    },
    websiteUrlPattern: {
      createModel: {
        name: 'Blog',
        description: 'some valid description',
        websiteUrl: 'foo_web_site',
      },
      responseModel: this.errorsResponse(['websiteUrl']),
      responseCode: HttpStatus.BAD_REQUEST,
    },
    spaces: {
      createModel: {
        name: '          ',
        description: '          ',
        websiteUrl: '          ',
      },
      responseModel: this.errorsResponse(['name', 'description', 'websiteUrl']),
      responseCode: HttpStatus.BAD_REQUEST,
    },
    name: {
      createModel: {
        name: '',
        description: 'some valid description',
        websiteUrl: 'http://www.validurl.com',
      },
      responseModel: this.errorsResponse(['name']),
      responseCode: HttpStatus.BAD_REQUEST,
    },
    nameAndDescription: {
      createModel: {
        name: '',
        description: '',
        websiteUrl: 'http://www.validurl.com',
      },
      responseModel: this.errorsResponse(['name', 'description']),
      responseCode: HttpStatus.BAD_REQUEST,
    },
  };
}
