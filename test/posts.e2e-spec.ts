// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from '../src/app.module';
//
// import mongoose from 'mongoose';
// import { appSettings } from '../src/settings/app.settings';
// import { MongooseModule } from '@nestjs/mongoose';
// import { BlogsTestManager } from './utils/test.manager.blogs';
// import { blogsDataset } from './datasets/blogs.dataset';
// import { TestViewModel } from './datasets/view.model';
//
// import { PostsTestManager } from './utils/test.manager.posts';
// import { PostsDataset } from './datasets/posts.dataset';
// import { HttpStatus, INestApplication } from '@nestjs/common';
// import { PostOutputDto } from '../src/features/blogs/posts/types/output';
//
// const db =
//   appSettings.api.MONGO_CONNECTION_URI + '/' + appSettings.api.MONGO_DB_NAME;
//
// describe.skip('Posts test', () => {
//   let app: INestApplication;
//   let postsTestManager: PostsTestManager;
//   let blogsTestManager: BlogsTestManager;
//
//   const postsDataset = new PostsDataset();
//
//   beforeAll(async () => {
//     await mongoose.connect(db); // Connecting to the database.
//
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [MongooseModule.forRoot(db), AppModule],
//     }).compile();
//
//     app = moduleFixture.createNestApplication();
//     await app.init();
//
//     //Init  test manager:
//     blogsTestManager = new BlogsTestManager(app);
//     postsTestManager = new PostsTestManager(app);
//   });
//
//   afterAll(async () => {
//     await mongoose.disconnect();
//   });
//
//   beforeEach(async () => {
//     await mongoose.connection.db.dropDatabase();
//   });
//
//   it(' - POST does not create new one with incorrect data (empty fields)', async () => {});
//
//   it(' - POST does not create the one with incorrect data (name and description over length)', async () => {});
//
//   it(' - POST does not create the one with incorrect websiteUrl (not url or over length)', async () => {});
//
//   it.skip(' - POST does not create the one with invalid authorization', async () => {});
//
//   it.only(' + POST should be create post with correct data', async () => {
//     const blog = await blogsTestManager.createOne(
//       blogsDataset.valid.createModel,
//     );
//     const blogId = blog.body.id;
//
//     const postsTestModel = postsDataset.valid;
//     postsTestModel.createModel.blogId = blogId;
//     const res = await postsTestManager.createOne(postsTestModel.createModel);
//     expect(res.statusCode).toBe(postsTestModel.responseCode);
//     expect(res.body).toEqual(postsTestModel.responseModel);
//   });
//
//   it(' - POST should be create the one with correct data on blogs/id/posts', async () => {});
//
//   // PUT requests
//   it(' - PUT does not update the one with incorrect data (no name)', async () => {});
//
//   it(' - PUT does not update the one with incorrect data (over length)', async () => {});
//
//   it(' - PUT does not update the one with incorrect data (no data but spaces)', async () => {});
//
//   it(' - PUT does not update the one with invalid authorization', async () => {});
//
//   it.only(' + PUT should update one field of the one with correct data', async () => {
//     const blog = await blogsTestManager.createOne(
//       blogsDataset.valid.createModel,
//     );
//     const blogId = blog.body.id;
//
//     const postsTestModel = postsDataset.valid;
//     postsTestModel.createModel.blogId = blogId;
//     const createdPost = await postsTestManager.createOne(
//       postsTestModel.createModel,
//     );
//     expect(createdPost.statusCode).toBe(postsTestModel.responseCode);
//
//     const updateModel = {
//       title: 'Post_title_new',
//     };
//
//     const updatedPost = await postsTestManager.updateOne(
//       updateModel,
//       createdPost.body.id,
//     );
//     expect(updatedPost.statusCode).toBe(HttpStatus.NO_CONTENT);
//
//     // check updated post content
//     const check = await postsTestManager.getOne(createdPost.body.id);
//     expect(check.statusCode).toBe(HttpStatus.OK);
//     expect(check.body).toEqual({ ...createdPost.body, ...updateModel });
//   });
//
//   it.only(' + PUT should update a lot of fields of the one with correct data', async () => {
//     const blog = await blogsTestManager.createOne(
//       blogsDataset.valid.createModel,
//     );
//     const blogId = blog.body.id;
//
//     const postsTestModel = postsDataset.valid;
//     postsTestModel.createModel.blogId = blogId;
//     const createdPost = await postsTestManager.createOne(
//       postsTestModel.createModel,
//     );
//     expect(createdPost.statusCode).toBe(postsTestModel.responseCode);
//
//     const updateModel = {
//       shortDescription: 'a very short new description ',
//       content: 'some new content',
//     };
//
//     const updatedPost = await postsTestManager.updateOne(
//       updateModel,
//       createdPost.body.id,
//     );
//     expect(updatedPost.statusCode).toBe(HttpStatus.NO_CONTENT);
//
//     // check updated post content
//     const check = await postsTestManager.getOne(createdPost.body.id);
//     expect(check.statusCode).toBe(HttpStatus.OK);
//     expect(check.body).toEqual({ ...createdPost.body, ...updateModel });
//   });
//
//   // GET requests
//
//   it.only(' + GET request without ID should return and empty array if has no posts', async () => {
//     const viewModel = new TestViewModel();
//     const res = await postsTestManager.getAll();
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual(viewModel);
//   });
//
//   it.only(' + GET request without ID should return array with length equal 5', async () => {
//     const blog = await blogsTestManager.createOne(
//       blogsDataset.valid.createModel,
//     );
//     const blogId = blog.body.id;
//     const posts = await postsTestManager.createMany(5, blogId);
//     const viewModel = new TestViewModel(1, 1, 10, 5, posts);
//
//     const res = await postsTestManager.getAll();
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual(viewModel);
//   });
//
//   it.only(' + GET with invalid ID should return 404', async () => {
//     const res = await postsTestManager.getOne('100invalidId');
//     expect(res.statusCode).toBe(404);
//   });
//
//   it.only(' + GET with valid ID should return 200 and object', async () => {
//     const blog = await blogsTestManager.createOne(
//       blogsDataset.valid.createModel,
//     );
//     const blogId = blog.body.id;
//     const postTestModel = postsDataset.valid;
//     postTestModel.createModel.blogId = blogId;
//     const createdPost = await postsTestManager.createOne(
//       postTestModel.createModel,
//     );
//     expect(createdPost.statusCode).toBe(201);
//
//     const res = await postsTestManager.getOne(createdPost.body.id);
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual(createdPost.body);
//   });
//
//   it(' - GET request with address /id/posts should return view model with 1 item', async () => {});
//
//   // DELETE request
//   it.only(' - delete with invalid ID should return 404', async () => {
//     const blog = await blogsTestManager.createOne(
//       blogsDataset.valid.createModel,
//     );
//     const blogId = blog.body.id;
//     const posts = await postsTestManager.createMany(10, blogId);
//
//     const res = await postsTestManager.deleteOne('postToDelete');
//     expect(res.statusCode).toBe(404);
//
//     const viewModel = new TestViewModel(1, 1, 10, 10, posts);
//     const check = await postsTestManager.getAll();
//     expect(check.statusCode).toBe(HttpStatus.OK);
//     expect(check.body).toEqual(viewModel);
//   });
//
//   it(' - delete with invalid authorization should return 401', async () => {});
//
//   it.only(' + delete with valid ID should return 204', async () => {
//     const blog = await blogsTestManager.createOne(
//       blogsDataset.valid.createModel,
//     );
//     const blogId = blog.body.id;
//     const posts = await postsTestManager.createMany(10, blogId);
//     const postToDelete = posts.find(
//       (el: PostOutputDto) => el.title === 'Post_title_7',
//     );
//     expect(postToDelete).not.toBeUndefined();
//
//     const res = await postsTestManager.deleteOne(postToDelete.id);
//     expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);
//
//     const postsAfterDelete = posts.filter(
//       (el: PostOutputDto) => el.title !== 'Post_title_7',
//     );
//
//     const viewModel = new TestViewModel(1, 1, 10, 9, postsAfterDelete);
//     const check = await postsTestManager.getAll();
//     expect(check.statusCode).toBe(HttpStatus.OK);
//     expect(check.body).toEqual(viewModel);
//   });
// });
