import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProcessDto } from 'src/dto/process/createProcessDto';
import { Process } from 'src/models/process.model';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { Account } from '../auth/account.decorator';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { EventGateway } from '../event/event.gateway';
import { Event } from '../event/event.model';
import { EditProcessDto } from './../../dto/process/editProcessDto';
import { ProcessesService } from './processes.service';

@ApiTags('processes')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('processes')
export class ProcessesController {
    constructor(
        private processesService: ProcessesService,
        private event: EventGateway
    ) { }

    @ApiOkResponse({ type: [Process] })
    @ApiQuery({ name: 'companyId', required: false })
    @ApiQuery({ name: 'assignedUserId', required: false })
    @ApiQuery({ name: 'orderId', required: false })
    @Permissions(Permission.PROCESS_VIEW)
    @Get()
    getAll(@Query() filter: { companyId: string, assignedUserId: string, orderId: string }) {
        return this.processesService.getAll(filter.companyId, filter.assignedUserId, filter.orderId);
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.PROCESS_VIEW)
    @Get(':processId')
    getById(@Param('processId') processId: string) {
        const process = this.processesService.getById(processId);
        if (process == null) throw new NotFoundException('Process not found!');
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.ORDER_EDIT)
    @Post()
    async create(@Account() user: User, @Body() createProcessDto: CreateProcessDto) {
        const process = await this.processesService.create(createProcessDto, user);
        if (process == null) throw new NotFoundException('Template not found!');
        this.event.triggerOther(Event.PROCESS_CREATE, user, process);
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.ORDER_EDIT)
    @Put(':processId')
    async edit(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string, @Body() editProcessDto: EditProcessDto) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        const process = await this.processesService.edit(processId, editProcessDto);
        this.event.triggerOther(Event.PROCESS_UPDATE, user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.ORDER_EDIT)
    @Delete(':processId')
    async delete(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        this.event.triggerOther(Event.PROCESS_DELETE, user, processId);
        return this.processesService.delete(processId);
    }
    @ApiOkResponse()
    @Permissions(Permission.PROCESS_EXECUTE)
    @Patch(':processId/enter')
    async enter(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        const process = await this.processesService.enter(processId, user);
        this.event.triggerOther(Event.PROCESS_UPDATE, user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.PROCESS_EXECUTE)
    @Patch(':processId/exit')
    async exit(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        const process = await this.processesService.exit(processId);
        this.event.triggerOther(Event.PROCESS_UPDATE, user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.PROCESS_EXECUTE)
    @Patch(':processId/start')
    async start(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string, @Body('userId') userId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        const process = await this.processesService.start(processId, userId);
        this.event.triggerOther(Event.PROCESS_UPDATE, user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.PROCESS_EXECUTE)
    @Patch(':processId/stop')
    async stop(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        const process = await this.processesService.stop(processId);
        this.event.triggerOther(Event.PROCESS_UPDATE, user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.PROCESS_ASSIGN)
    @Patch(':processId/assign')
    async assign(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string, @Body('assigneeId') assigneeId: string) {
        let process = await this.processesService.getById(processId);
        if (!process) throw new NotFoundException('Process not found!');
        if (process.occupiedBy) throw new ForbiddenException('Process occupied!');

        process = await this.processesService.assign(processId, assigneeId);
        this.event.triggerOther(Event.PROCESS_UPDATE, user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.PROCESS_EXECUTE)
    @Patch(':processId/finish')
    async finish(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        const process = await this.processesService.finish(processId, undefined);
        this.event.triggerOther(Event.PROCESS_UPDATE, user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.PROCESS_EXECUTE)
    @Patch(':processId/switch')
    async switch(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string, @Body('stepIndex') stepIndex: number) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        const process = await this.processesService.switch(processId, stepIndex);
        this.event.triggerOther(Event.PROCESS_UPDATE, user, process);
        return process;
    }
}

