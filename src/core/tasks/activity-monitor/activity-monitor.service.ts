import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { UsersService } from 'src/core/users/users.service';

@Injectable()
export class ActivityMonitorService {
    constructor(private usersService: UsersService) {

    }

    @Interval(5000)
    handleRunningProcesses() {
        this.usersService.updateActivities();
    }
}
