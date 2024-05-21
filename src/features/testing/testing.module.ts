import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { TestingService } from './application/testing.service';
import { TestingRepository } from './infrastucture/testing.repository';

@Module({
  imports: [],
  controllers: [TestingController],
  providers: [TestingService, TestingRepository],
  exports: [],
})
export class TestingModule {}
