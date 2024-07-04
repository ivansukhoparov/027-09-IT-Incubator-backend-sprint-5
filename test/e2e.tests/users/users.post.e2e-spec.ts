import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersTestManager } from '../../utils/test.manager.users';
import {
  TestsCreateUserModel,
  userCreateModelNoData,
  userCreateModelNoEmail,
  userCreateModelNoLogin,
  userCreateModelNoPassword,
} from './dataset/users.models';
import { createLengthString, ErrorsResponse } from '../../datasets/dataset';
import { creteTestApp } from '../../common/create.test.app';

describe('sa/users POST test', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let usersTestManagerNotAuth: UsersTestManager;
  const errorsResponse: ErrorsResponse = new ErrorsResponse();

  beforeAll(async () => {
    app = await creteTestApp();

    usersTestManager = new UsersTestManager(app);
    usersTestManagerNotAuth = new UsersTestManager(app, {
      user: 'notAdmin',
      password: 'wrongPassword',
    });
  });

  afterAll(async () => {});

  beforeEach(async () => {
    const deleteAll = await request(app.getHttpServer()).delete('/testing/all-data');
    expect(deleteAll.statusCode).toBe(HttpStatus.NO_CONTENT);
  });

  it('- POST request should not create user if ONE OF FIELD DOES NOT SEND and return status code 400 with errors array', async () => {
    // With no login field
    // @ts-ignore
    await usersTestManager.createOne(userCreateModelNoLogin).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['login']));
    });

    // With no email field
    // @ts-ignore
    await usersTestManager.createOne(userCreateModelNoEmail).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['email']));
    });

    // With no password field
    // @ts-ignore
    await usersTestManager.createOne(userCreateModelNoPassword).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['password']));
    });

    // With no any field
    // @ts-ignore
    await usersTestManager.createOne(userCreateModelNoData).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['login', 'password', 'email']));
    });
  });

  it('- POST request should not create user if ONE OR MORE OF FIELDS TOO SHORT and return status code 400 with errors array', async () => {
    // With too short login field
    const createUserDtoInvalidLogin = new TestsCreateUserModel(1);
    createUserDtoInvalidLogin.login = createLengthString(2);
    await usersTestManager.createOne(createUserDtoInvalidLogin).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['login']));
    });

    // With too short password field
    const createUserDtoInvalidPassword = new TestsCreateUserModel(1);
    createUserDtoInvalidPassword.password = createLengthString(5);
    await usersTestManager.createOne(createUserDtoInvalidPassword).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['password']));
    });
  });

  it('- POST request should not create user if ONE OR MORE OF FIELDS TOO LONG and return status code 400 with errors array', async () => {
    // With too short login field
    const createUserDtoInvalidLogin = new TestsCreateUserModel(1);
    createUserDtoInvalidLogin.login = createLengthString(11);

    await usersTestManager.createOne(createUserDtoInvalidLogin).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['login']));
    });

    // With too short password field
    const createUserDtoInvalidPassword = new TestsCreateUserModel(1);
    createUserDtoInvalidPassword.password = createLengthString(21);
    await usersTestManager.createOne(createUserDtoInvalidPassword).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['password']));
    });
  });

  it('- POST request should not create user if ONE OF FIELD IS EMPTY and return status code 400 with errors array', async () => {
    // With empty login field
    const createUserDtoInvalidLogin = new TestsCreateUserModel(1);
    createUserDtoInvalidLogin.login = '';
    await usersTestManager.createOne(createUserDtoInvalidLogin).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['login']));
    });

    // With empty password field
    const createUserDtoInvalidPassword = new TestsCreateUserModel(1);
    createUserDtoInvalidPassword.password = '';
    await usersTestManager.createOne(createUserDtoInvalidPassword).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['password']));
    });

    // With empty email field
    const createUserDtoInvalidEmail = new TestsCreateUserModel(1);
    createUserDtoInvalidEmail.password = '';
    await usersTestManager.createOne(createUserDtoInvalidEmail).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['password']));
    });
  });

  it('- POST request should not create user if sent WRONG CREDENTIALS with correct create model status code 401', async () => {
    await usersTestManagerNotAuth.createOne(new TestsCreateUserModel(1)).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  it('+ POST request should create user and return new user with status code 201', async () => {
    await usersTestManager.createOne(new TestsCreateUserModel(1)).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.CREATED);
    });
  });
});
