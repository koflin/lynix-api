import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GetProcessesDto } from 'src/dto/process/getProcesses.dto';
import { Process } from 'src/models/process.model';
import { User } from 'src/models/user.model';

import { UsersService } from '../users/users.service';
import { ProcessesService } from './processes.service';

@Resolver(of => Process)
export class ProcessesResolver {
    constructor(
        private processesService: ProcessesService,
        private usersService: UsersService
    ) {
    }

    @Query(returns => [Process], { name: 'processes' })
    async getProcesses(@Args() args: GetProcessesDto, @Args('companyId') companyId: string) {
        return this.processesService.getAll(args, companyId);
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