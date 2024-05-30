import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserOutputModel } from '../../src/features/users/api/admin/models/user.ouput.model';
import { CreateUserDto } from '../datasets/users.dataset';

export class UsersTestManager {
  private endPoint: string = '/sa/users/';

  constructor(
    protected readonly app: INestApplication,
    private accessData: any = {
      user: 'admin',
      password: 'qwerty',
    },
  ) {}

  async createOne(createModel: any) {
    return await request(this.app.getHttpServer())
      .post(this.endPoint)
      .auth(this.accessData.user, this.accessData.password)
      .send(createModel);
  }

  createMany = async (numberOfEntities: number) => {
    const users: Array<UserOutputModel> = [];

    for (let i = 1; i <= numberOfEntities; i++) {
      const createModel = new CreateUserDto(i);
      const res = await this.createOne(createModel);
      users.push(res.body);
    }
    return users.reverse();
  };

  async getOne(id: string) {
    return await request(this.app.getHttpServer()).get(this.endPoint + id);
  }

  async getAll(queryString?: string) {
    if (queryString) {
      return await request(this.app.getHttpServer()).get(
        this.endPoint + queryString,
      );
    } else {
      return await request(this.app.getHttpServer()).get(this.endPoint);
    }
  }

  async deleteOne(id: string) {
    return await request(this.app.getHttpServer())
      .delete(this.endPoint + id)
      .auth(this.accessData.user, this.accessData.password);
  }
}
