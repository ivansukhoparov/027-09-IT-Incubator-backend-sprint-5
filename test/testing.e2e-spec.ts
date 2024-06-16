// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from '../src/app.module';
// import { HttpStatus, INestApplication } from '@nestjs/common';
// import mongoose from 'mongoose';
// import { appSettings } from '../src/settings/app.settings';
// import { MongooseModule } from '@nestjs/mongoose';
// import { BlogsTestManager } from './utils/test.manager.blogs';
// import { blogsDataset } from './datasets/blogs.dataset';
// import { TestViewModel } from './datasets/view.model';
// import { PostsTestManager } from './utils/test.manager.posts';
// import request from 'supertest';
//
// const db =
//   appSettings.api.MONGO_CONNECTION_URI + '/' + appSettings.api.MONGO_DB_NAME;
//
// describe('Posts test', () => {
//   let app: INestApplication;
//   let postsTestManager: PostsTestManager;
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
//   it(' - DELETE testing/all-data endpoint must delete all data in DB', async () => {
//     // create blog and post and check they are exist
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
//
//     // make DELETE request to testing/all-data
//     const deleteAll = await request(app.getHttpServer()).delete(
//       '/testing/all-data',
//     );
//     expect(deleteAll.statusCode).toBe(HttpStatus.NO_CONTENT);
//
//     // requests should be return empty view models
//
//     const emptyViewModel = new TestViewModel();
//     const postsCheck = await postsTestManager.getAll();
//     expect(postsCheck.statusCode).toBe(200);
//     expect(postsCheck.body).toEqual(emptyViewModel);
//
//     const blogsCheck = await postsTestManager.getAll();
//     expect(blogsCheck.statusCode).toBe(200);
//     expect(blogsCheck.body).toEqual(emptyViewModel);
//   });
// });
