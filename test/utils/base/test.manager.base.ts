import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ITestsCreateModel } from './tests.create.model.interface';
import { credentialsType } from '../../common/tests.settings';

export abstract class TestManagerBase<EntityOutputModel> {
  constructor(
    protected readonly app: INestApplication,
    protected accessData: credentialsType,
    protected createModel: ITestsCreateModel,
    protected endPoint: string,
  ) {}

  async createOne(createModel: any = this.createModel) {
    return await request(this.app.getHttpServer()).post(this.endPoint).auth(this.accessData.user, this.accessData.password).send(createModel);
  }

  createMany = async (numberOfEntities: number) => {
    const users: Array<EntityOutputModel> = [];

    for (let i = 1; i <= numberOfEntities; i++) {
      this.createModel.extendModel(i);
      const res = await this.createOne(this.createModel);
      users.push(res.body);
    }
    return users.reverse();
  };

  async get(addressExtender: string = '', queryString: string = '') {
    return await request(this.app.getHttpServer()).get(this.endPoint + addressExtender + queryString);
  }

  async getWithAuth(addressExtender: string = '', queryString: string = '') {
    return await request(this.app.getHttpServer())
      .get(this.endPoint + addressExtender + queryString)
      .auth(this.accessData.user, this.accessData.password);
  }

  async delete(id: string) {
    return await request(this.app.getHttpServer())
      .delete(this.endPoint + '/' + id)
      .auth(this.accessData.user, this.accessData.password);
  }
}
