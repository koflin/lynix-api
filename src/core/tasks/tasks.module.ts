import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { ProcessesModule } from './../processes/processes.module';
import { ActivityMonitorService } from './activity-monitor/activity-monitor.service';
import { ProcessRunnerService } from './process-runner/process-runner.service';

@Module({
  providers: [ProcessRunnerService, ActivityMonitorService],
  imports: [ProcessesModule, UsersModule],
  exports: [ProcessRunnerService]
})
export class TasksModule {}
