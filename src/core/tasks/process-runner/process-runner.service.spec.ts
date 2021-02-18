import { Test, TestingModule } from '@nestjs/testing';
import { ProcessRunnerService } from './process-runner.service';

describe('ProcessRunnerService', () => {
  let service: ProcessRunnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessRunnerService],
    }).compile();

    service = module.get<ProcessRunnerService>(ProcessRunnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
