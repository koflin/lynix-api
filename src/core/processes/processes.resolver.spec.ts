import { Test, TestingModule } from '@nestjs/testing';
import { ProcessesResolver } from './processes.resolver';

describe('ProcessesResolver', () => {
  let resolver: ProcessesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessesResolver],
    }).compile();

    resolver = module.get<ProcessesResolver>(ProcessesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
