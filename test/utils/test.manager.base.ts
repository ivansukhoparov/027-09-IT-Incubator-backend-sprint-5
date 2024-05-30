import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export interface ITestsCreateModel {
  extendModel(counter: string | number): void;
}

export abstract class TestManagerBase<EntityOutputModel> {
  protected constructor(
    protected readonly app: INestApplication,
    private endPoint: string,
    private createModel: ITestsCreateModel,
    private accessData: any = {
      user: 'admin',
      password: 'qwerty',
    },
  ) {}

  async createOne(createModel: any = this.createModel) {
    return await request(this.app.getHttpServer())
      .post(this.endPoint)
      .auth(this.accessData.user, this.accessData.password)
      .send(createModel);
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
