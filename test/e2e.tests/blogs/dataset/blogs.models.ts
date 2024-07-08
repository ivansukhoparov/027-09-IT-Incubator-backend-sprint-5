import { ITestsCreateModel } from '../../../utils/base/tests.create.model.interface';

export class TestsCreateBlogModel implements ITestsCreateModel {
  name: string = 'Blog';
  description: string = 'Blog valid short description';
  websiteUrl: string = 'http://example.com';

  constructor(counter?: string | number) {
    if (counter) this.extendModel(counter);
  }

  extendModel(counter: string | number) {
    this.name = 'Blog_' + counter;
    this.websiteUrl = 'http://example' + counter + '.com';
  }
}

export const blogCreateModelNoName = {
  description: 'Blog valid short description',
  websiteUrl: 'example@example.com',
};
export const blogCreateModelNoDescription = {
  name: 'Blog',
  websiteUrl: 'http://example.com',
};
export const blogCreateModelNoWebSiteUrl = {
  name: 'Blog',
  description: 'Blog valid short description',
};
export const blogCreateModelNoData = {};
