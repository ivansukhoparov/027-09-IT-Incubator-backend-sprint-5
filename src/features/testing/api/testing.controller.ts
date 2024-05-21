import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingService } from '../application/testing.service';

@Controller('testing')
export class TestingController {
  constructor(protected testingService: TestingService) {}
  @Delete('/all-data/')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllData() {
    await this.testingService.deleteAll();
    return;
  }
}
