import { ProcessesModule } from './../processes/processes.module';
import { ProcessesService } from './../processes/processes.service';
import { Module } from '@nestjs/common';
import { ProcessRunnerService } from './process-runner/process-runner.service';

@Module({
  providers: [ProcessRunnerService],
  imports: [ProcessesModule],
  exports: [ProcessRunnerService]
})
export class TasksModule {}
