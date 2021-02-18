import { ProcessesService } from './../../processes/processes.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { Console } from 'console';

@Injectable()
export class ProcessRunnerService {

    constructor(private processService: ProcessesService) {
    }

    @Interval(1000)
    handleRunningProcesses() {
        this.processService.updateRunning();
    }
}
