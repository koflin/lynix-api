import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GetProcessesDto } from 'src/dto/process/getProcesses.dto';
import { Process } from 'src/models/process.model';
import { User } from 'src/models/user.model';

import { Account } from '../auth/account.decorator';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { UsersService } from '../users/users.service';
import { ProcessesService } from './processes.service';

@UseGuards(UserAuthGuard)
@Resolver(of => Process)
export class ProcessesResolver {
    constructor(
        private processesService: ProcessesService,
        private usersService: UsersService
    ) {
    }

    @Query(returns => [Process], { name: 'processes' })
    async getProcesses(@Args() args: GetProcessesDto, @Account() user: User) {
        console.log(args);
        return this.processesService.getAll(args, user.companyId);
    }

    @ResolveField('assignedUser', type => User, { nullable: true })
    async getAssignedUser(@Parent() process: Process) {
        return this.usersService.getById(process.assignedUserId);
    }

    @ResolveField('occupiedBy', type => User, { nullable: true })
    async getOccupiedBy(@Parent() process: Process) {
        return this.usersService.getById(process.occupiedById);
    }
}