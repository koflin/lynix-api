import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { ProcessesService } from './../../processes/processes.service';

@Injectable()
export class ProcessRunnerService {

    constructor(private processService: ProcessesService) {
    }

    @Interval(1000)
    handleRunningProcesses() {
        this.processService.updateOccupied();
    }
}
