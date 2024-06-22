import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersTestManager } from '../../utils/test.manager.users';
import { creteTestApp } from '../../common/create.test.app';
import { AuthTestManager } from '../../utils/test.manager.auth';
import { createLengthString, ErrorsResponse } from '../../datasets/dataset';
import {
  authRegistrationModelNoLogin,
  authRegistrationNoData,
  authRegistrationNoEmail,
  authRegistrationNoPassword,
  TestsRegistrationModel,
} from './datasets/auth.models';

describe('Auth tests', () => {
  let app: INestApplication;
  let authTestManager: AuthTestManager;
  let usersTestManager: UsersTestManager;
  const errorsResponse: ErrorsResponse = new ErrorsResponse();

  beforeAll(async () => {
    app = await creteTestApp();
    authTestManager = new AuthTestManager(app);
    usersTestManager = new UsersTestManager(app);

    const deleteAll = await request(app.getHttpServer()).delete('/testing/all-data');
    expect(deleteAll.statusCode).toBe(HttpStatus.NO_CONTENT);
  });

  afterAll(async () => {});

  beforeEach(async () => {});

  it(`- POST request to auth/register should not create user if ONE OR MORE OF FIELDS DOESN'T SENT and return status 
  code 400 with errors array`, async () => {
    // With no login field

    await authTestManager
      /* @ts-ignore*/
      .registration(authRegistrationModelNoLogin)
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.body).toEqual(errorsResponse.getBody(['login']));
      });

    // With no email field
    await authTestManager
      /* @ts-ignore*/
      .registration(authRegistrationNoEmail)
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.body).toEqual(errorsResponse.getBody(['email']));
      });

    // With no password field
    await authTestManager
      /* @ts-ignore*/
      .registration(authRegistrationNoPassword)
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.body).toEqual(errorsResponse.getBody(['password']));
      });

    // With no any field
    await authTestManager
      /* @ts-ignore*/
      .registration(authRegistrationNoData)
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.body).toEqual(errorsResponse.getBody(['login', 'password', 'email']));
      });
  });

  it('- POST request to auth/register should not create user if ONE OR MORE OF FIELDS TOO SHORT and return status code 400 with errors array', async () => {
    // With too short login field
    const createUserDtoInvalidLogin = new TestsRegistrationModel(1);
    createUserDtoInvalidLogin.login = createLengthString(2);
    await authTestManager.registration(createUserDtoInvalidLogin).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['login']));
    });

    // With too short password field
    const createUserDtoInvalidPassword = new TestsRegistrationModel(1);
    createUserDtoInvalidPassword.password = createLengthString(5);
    await usersTestManager.createOne(createUserDtoInvalidPassword).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['password']));
    });
  });

  it('- POST request to auth/register should not create user if ONE OR MORE OF FIELDS TOO LONG and return status code 400 with errors array', async () => {
    // With too short login field
    const createUserDtoInvalidLogin = new TestsRegistrationModel(1);
    createUserDtoInvalidLogin.login = createLengthString(11);

    await authTestManager.registration(createUserDtoInvalidLogin).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['login']));
    });

    // With too short password field
    const createUserDtoInvalidPassword = new TestsRegistrationModel(1);
    createUserDtoInvalidPassword.password = createLengthString(21);
    await usersTestManager.createOne(createUserDtoInvalidPassword).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['password']));
    });
  });

  it('- POST request to auth/register should not create user if ONE OF FIELD IS EMPTY and return status code 400 with errors array', async () => {
    // With empty login field
    const createUserDtoInvalidLogin = new TestsRegistrationModel(1);
    createUserDtoInvalidLogin.login = '';
    await authTestManager.registration(createUserDtoInvalidLogin).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['login']));
    });

    // With empty password field
    const createUserDtoInvalidPassword = new TestsRegistrationModel(1);
    createUserDtoInvalidPassword.password = '';
    await usersTestManager.createOne(createUserDtoInvalidPassword).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['password']));
    });

    // With empty email field
    const createUserDtoInvalidEmail = new TestsRegistrationModel(1);
    createUserDtoInvalidEmail.password = '';
    await authTestManager.registration(createUserDtoInvalidEmail).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['password']));
    });
  });

  it(`+ POST request to auth/register with correct input model should create user and return status 204;
  use additional methods GET to sa/users`, async () => {
    const registrationModel = new TestsRegistrationModel();
    await authTestManager.registration(registrationModel).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);
    });
    const users = await usersTestManager.getWithAuth();
    expect(users.body.items).toHaveLength(1);
    expect(users.body.items[0].email).toBe(registrationModel.email);
    expect(users.body.items[0].login).toBe(registrationModel.login);
  });

  it(`- POST request to auth/register with correct input model should not to create user if the user with the
  given login already exists and return error message status code  400;
   use additional methods GET to sa/users`, async () => {
    const registrationModel = new TestsRegistrationModel();
    registrationModel.email = 'myelamil@maol.com';
    await authTestManager.registration(registrationModel).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['login']));
    });
  });

  it(`- POST request to auth/register with correct input model should not to create user if the user with the
  given email already exists and return error message status code  400;
   use additional methods GET to sa/users`, async () => {
    const registrationModel = new TestsRegistrationModel();
    registrationModel.login = 'newLogin';
    await authTestManager.registration(registrationModel).then((res) => {
      expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body).toEqual(errorsResponse.getBody(['email']));
    });
  });
});
