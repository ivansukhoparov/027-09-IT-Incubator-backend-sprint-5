import { Injectable } from '@nestjs/common';
import { TestingRepository } from '../infrastucture/testing.repository';

@Injectable()
export class TestingService {
  constructor(protected testingRepository: TestingRepository) {}

  async deleteAll() {
    try {
      //this.testingRepository.dropDb();
      await this.testingRepository.deleteAll();
    } catch {
      console.log('main method has failed, try additional method');
    }
  }
}
