// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from '../src/app.module';
//
// import { HttpCode, HttpStatus, INestApplication } from '@nestjs/common';
// import mongoose from 'mongoose';
// import { appSettings } from '../src/settings/app.settings';
// import { MongooseModule } from '@nestjs/mongoose';
// import { BlogsTestManager } from './utils/test.manager.blogs';
// import { blogsDataset } from './datasets/blogs.dataset';
// import { TestViewModel } from './datasets/view.model';
// import { BlogOutputDto } from '../src/features/blogs/types/output';
// const db =
//   appSettings.api.MONGO_CONNECTION_URI + '/' + appSettings.api.MONGO_DB_NAME;
//
// describe.skip('Blogs test', () => {
//   let app: INestApplication;
//   let blogsTestManager: BlogsTestManager;
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
//     //Init blogs test manager:
//     blogsTestManager = new BlogsTestManager(app);
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
//   it(' - POST does not create new blog with incorrect data (empty fields)', async () => {});
//
//   it(' - POST does not create the blog with incorrect data (name and description over length)', async () => {});
//
//   it(' - POST does not create the blog with incorrect websiteUrl (not url or over length)', async () => {});
//
//   it.skip(' - POST does not create the blog with invalid authorization', async () => {});
//
//   it.only(' + POST should be create the blog with correct data', async () => {
//     const testModel = blogsDataset.valid;
//     const res = await blogsTestManager.createOne(testModel.createModel);
//     expect(res.statusCode).toBe(testModel.responseCode);
//     expect(res.body).toEqual(testModel.responseModel);
//   });
//
//   it(' - POST should be create the blog with correct data on blogs/id/posts', async () => {});
//
//   // PUT requests
//   it(' - PUT does not update the blog with incorrect data (no name)', async () => {});
//
//   it(' - PUT does not update the blog with incorrect data (over length)', async () => {});
//
//   it(' - PUT does not update the blog with incorrect data (no data but spaces)', async () => {});
//
//   it(' - PUT does not update the blog with invalid authorization', async () => {});
//
//   it.only(' + PUT should update one field of the blog with correct data', async () => {
//     const testModel = blogsDataset.valid;
//     const createdBlog = await blogsTestManager.createOne(testModel.createModel);
//     expect(createdBlog.statusCode).toBe(testModel.responseCode);
//
//     const updateModel = {
//       name: 'Blog_2',
//     };
//
//     const updatedBlog = await blogsTestManager.updateOne(
//       updateModel,
//       createdBlog.body.id,
//     );
//
//     expect(updatedBlog.statusCode).toBe(HttpStatus.NO_CONTENT);
//     expect(updatedBlog.body).toEqual({});
//   });
//
//   it.only(' + PUT should update a lot of fields of the blog with correct data', async () => {
//     const testModel = blogsDataset.valid;
//     const createdBlog = await blogsTestManager.createOne(testModel.createModel);
//     expect(createdBlog.statusCode).toBe(testModel.responseCode);
//
//     const updateModel = {
//       name: 'Blog_3',
//       description: 'some valid description, but lorem ipsum',
//       websiteUrl: 'http://www.updated.com',
//     };
//
//     const updatedBlog = await blogsTestManager.updateOne(
//       updateModel,
//       createdBlog.body.id,
//     );
//
//     expect(updatedBlog.statusCode).toBe(HttpStatus.NO_CONTENT);
//     expect(updatedBlog.body).toEqual({});
//   });
//
//   // GET requests
//
//   it.only(' + GET request without ID should return and empty array if no blogs', async () => {
//     const viewModel = new TestViewModel();
//     const res = await blogsTestManager.getAll();
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual(viewModel);
//   });
//
//   it.only(' + GET request without ID should return array with length equal 5', async () => {
//     const blogs = await blogsTestManager.createMany(5);
//     const viewModel = new TestViewModel(1, 1, 10, 5, blogs);
//
//     const res = await blogsTestManager.getAll();
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual(viewModel);
//   });
//
//   it.only(' + GET with invalid ID should return 404', async () => {
//     const res = await blogsTestManager.getOne('100invalidId');
//     expect(res.statusCode).toBe(404);
//   });
//
//   it.only(' + GET with valid ID should return 200 and object', async () => {
//     const testModel = blogsDataset.valid;
//     const createdBlog = await blogsTestManager.createOne(testModel.createModel);
//     expect(createdBlog.statusCode).toBe(201);
//
//     const res = await blogsTestManager.getOne(createdBlog.body.id);
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual(createdBlog.body);
//   });
//
//   it(' - GET request with address /id/posts should return view model with 1 item', async () => {});
//
//   // DELETE request
//   it.only(' - delete with invalid ID should return 404', async () => {
//     const blogs = await blogsTestManager.createMany(10);
//
//     const res = await blogsTestManager.deleteOne('blogToDelete.id');
//     expect(res.statusCode).toBe(404);
//
//     const viewModel = new TestViewModel(1, 1, 10, 10, blogs);
//     const checkRes = await blogsTestManager.getAll();
//     expect(checkRes.statusCode).toBe(HttpStatus.OK);
//     expect(checkRes.body).toEqual(viewModel);
//   });
//
//   it(' - delete with invalid authorization should return 401', async () => {});
//
//   it.only(' + delete with valid ID should return 204', async () => {
//     const blogs = await blogsTestManager.createMany(10);
//     const blogToDelete = blogs.find(
//       (el: BlogOutputDto) => el.name === 'Blog_7',
//     );
//     expect(blogToDelete).not.toBeUndefined();
//
//     const res = await blogsTestManager.deleteOne(blogToDelete.id);
//     expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);
//
//     const blogsAfterDelete = blogs.filter(
//       (el: BlogOutputDto) => el.name !== 'Blog_7',
//     );
//
//     const viewModel = new TestViewModel(1, 1, 10, 9, blogsAfterDelete);
//     const checkRes = await blogsTestManager.getAll();
//     expect(checkRes.statusCode).toBe(HttpStatus.OK);
//     expect(checkRes.body).toEqual(viewModel);
//   });
// });
