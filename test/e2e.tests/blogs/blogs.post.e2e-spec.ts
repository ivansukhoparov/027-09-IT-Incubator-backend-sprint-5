import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { BlogsTestManager } from '../../utils/test.manager.blogs';

import { createLengthString, ErrorsResponse } from '../../datasets/dataset';
import { creteTestApp } from '../../common/create.test.app';
import { blogCreateModelNoDescription, blogCreateModelNoName, blogCreateModelNoWebSiteUrl, TestsCreateBlogModel } from './dataset/blogs.models';

describe('sa/blogs POST test', () => {
  let app: INestApplication;
  let blogsTestManager: BlogsTestManager;
  let blogsTestManagerNotAuth: BlogsTestManager;
  const errorsResponse: ErrorsResponse = new ErrorsResponse();

  beforeAll(async () => {
    app = await creteTestApp();

    blogsTestManager = new BlogsTestManager(app);
    blogsTestManagerNotAuth = new BlogsTestManager(app, {
      user: 'notAdmin',
      password: 'wrongPassword',
    });
  });

  afterAll(async () => {});

  beforeEach(async () => {
    const deleteAll = await request(app.getHttpServer()).delete('/testing/all-data');
    expect(deleteAll.statusCode).toBe(HttpStatus.NO_CONTENT);
  });

  it('- POST request should not create blog if ONE OF FIELD DOES NOT SEND and return status code 400 with errors array', async () => {
    // With no login field
    // @ts-ignore
    await blogsTestManager.createOne(blogCreateModelNoName).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['name']));
    });

    // With no email field
    // @ts-ignore
    await blogsTestManager.createOne(blogCreateModelNoDescription).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['description']));
    });

    // With no password field
    // @ts-ignore
    await blogsTestManager.createOne(blogCreateModelNoWebSiteUrl).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['websiteUrl']));
    });

    // With no any field
    // @ts-ignore
    await blogsTestManager.createOne(BlogCreateModelNoData).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['name', 'description', 'websiteUrl']));
    });
  });

  it('- POST request should not create Blog if ONE OR MORE OF FIELDS TOO SHORT and return status code 400 with errors array', async () => {
    // With too short name field
    const createBlogDtoInvalidLogin = new TestsCreateBlogModel(1);
    createBlogDtoInvalidLogin.name = createLengthString(1);
    await blogsTestManager.createOne(createBlogDtoInvalidLogin).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['name']));
    });

    // With too short description field
    const createBlogDtoInvalidDesctiption = new TestsCreateBlogModel(1);
    createBlogDtoInvalidDesctiption.description = createLengthString(1);
    await blogsTestManager.createOne(createBlogDtoInvalidDesctiption).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['description']));
    });

    // With too short websiteUrl field
    const createBlogDtoInvalidWebsite = new TestsCreateBlogModel(1);
    createBlogDtoInvalidWebsite.websiteUrl = createLengthString(1);
    await blogsTestManager.createOne(createBlogDtoInvalidWebsite).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['websiteUrl']));
    });
  });

  it('- POST request should not create Blog if ONE OR MORE OF FIELDS TOO LONG and return status code 400 with errors array', async () => {
    // With too short name field
    const createBlogDtoInvalidName = new TestsCreateBlogModel(1);
    createBlogDtoInvalidName.name = createLengthString(16);

    await blogsTestManager.createOne(createBlogDtoInvalidName).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['name']));
    });

    // With too short description field
    const createBlogDtoInvalidDescriptiom = new TestsCreateBlogModel(1);
    createBlogDtoInvalidDescriptiom.description = createLengthString(501);
    await blogsTestManager.createOne(createBlogDtoInvalidDescriptiom).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['description']));
    });

    // With too short websiteUrl field
    const createBlogDtoInvalidWebsite = new TestsCreateBlogModel(1);
    createBlogDtoInvalidWebsite.websiteUrl = createLengthString(101);
    await blogsTestManager.createOne(createBlogDtoInvalidWebsite).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['websiteUrl']));
    });
  });

  it('- POST request should not create Blog if ONE OF FIELD IS EMPTY and return status code 400 with errors array', async () => {
    // With empty name field
    const createBlogDtoInvalidName = new TestsCreateBlogModel(1);
    createBlogDtoInvalidName.name = '';
    await blogsTestManager.createOne(createBlogDtoInvalidName).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['name']));
    });

    // With empty description field
    const createBlogDtoInvalidDescriptiom = new TestsCreateBlogModel(1);
    createBlogDtoInvalidDescriptiom.description = '';
    await blogsTestManager.createOne(createBlogDtoInvalidDescriptiom).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['description']));
    });

    // With too short websiteUrl field
    const createBlogDtoInvalidWebsite = new TestsCreateBlogModel(1);
    createBlogDtoInvalidWebsite.websiteUrl = '';
    await blogsTestManager.createOne(createBlogDtoInvalidWebsite).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['websiteUrl']));
    });
  });

  it('- POST request should not create Blog if sent WRONG CREDENTIALS with correct create model status code 401', async () => {
    await blogsTestManagerNotAuth.createOne(new TestsCreateBlogModel(1)).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it('+ POST request should create Blog and return new Blog with status code 201', async () => {
    await blogsTestManager.createOne(new TestsCreateBlogModel(1)).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({
        id: expect.any(String),
        name: 'Blog_1',
        description: 'Blog valid short description',
        websiteUrl: 'http://example1.com',
        createdAt: expect.any(String),
        isMembership: false,
      });
    });
  });
});
