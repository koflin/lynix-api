import { Test, TestingModule } from '@nestjs/testing';
import { ProcessesController } from './processes.controller';

describe('Processes Controller', () => {
  let controller: ProcessesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessesController],
    }).compile();

    controller = module.get<ProcessesController>(ProcessesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
