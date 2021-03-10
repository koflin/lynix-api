import { Test, TestingModule } from '@nestjs/testing';
import { ActivityMonitorService } from './activity-monitor.service';

describe('ActivityMonitorService', () => {
  let service: ActivityMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityMonitorService],
    }).compile();

    service = module.get<ActivityMonitorService>(ActivityMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
