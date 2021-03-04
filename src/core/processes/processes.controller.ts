import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProcessDto } from 'src/dto/process/createProcessDto';
import { Process } from 'src/models/process.model';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CompaniesGuard } from '../companies/companies.guard';
import { EventGateway } from '../event/event.gateway';
import { Event } from '../event/event.model';
import { EditProcessDto } from './../../dto/process/editProcessDto';
import { ProcessesService } from './processes.service';

@ApiTags('processes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompaniesGuard, PermissionsGuard)
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
    @Permissions(Permission.VIEW)
    @Get()
    getAll(@Query() filter: { companyId: string, assignedUserId: string, orderId: string }) {
        return this.processesService.getAll(filter);
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.VIEW)
    @Get(':processId')
    getById(@Param('processId') processId: string) {
        let process = this.processesService.getById(processId);
        if (process == null) throw new NotFoundException('Process not found!');
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.EDIT)
    @Post()
    async create(@Request() req: { user: User }, @Body() createProcessDto: CreateProcessDto) {
        let process = await this.processesService.create(createProcessDto, req.user);
        if (process == null) throw new NotFoundException('Template not found!');
        this.event.trigger(Event.PROCESS_CREATE, req.user, process);
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.EDIT)
    @Put(':processId')
    async edit(@Request() req: { user: User }, @Param('processId', new ParseIdPipe()) processId: string, @Body() editProcessDto: EditProcessDto) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        let process = await this.processesService.edit(processId, editProcessDto);
        this.event.trigger(Event.PROCESS_UPDATE, req.user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.EDIT)
    @Delete(':processId')
    async delete(@Request() req: { user: User }, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        this.event.trigger(Event.PROCESS_DELETE, req.user, processId);
        return this.processesService.delete(processId);
    }
    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Patch(':processId/enter')
    async enter(@Request() req: { user: User }, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        let process =  this.processesService.enter(processId);
        this.event.trigger(Event.PROCESS_UPDATE, req.user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Patch(':processId/exit')
    async exit(@Request() req: { user: User }, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        let process = this.processesService.exit(processId);
        this.event.trigger(Event.PROCESS_UPDATE, req.user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Patch(':processId/start')
    async start(@Request() req: { user: User }, @Param('processId', new ParseIdPipe()) processId: string, @Body('userId') userId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        let process = this.processesService.start(processId, userId);
        this.event.trigger(Event.PROCESS_UPDATE, req.user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Patch(':processId/stop')
    async stop(@Request() req: { user: User }, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        let process = this.processesService.stop(processId);
        this.event.trigger(Event.PROCESS_UPDATE, req.user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.ASSIGN)
    @Patch(':processId/assign')
    async assign(@Request() req: { user: User }, @Param('processId', new ParseIdPipe()) processId: string, @Body('assigneeId') assigneeId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        let process = this.processesService.assign(processId, assigneeId);
        this.event.trigger(Event.PROCESS_UPDATE, req.user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Patch(':processId/finish')
    async finish(@Request() req: { user: User }, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        let process = this.processesService.finish(processId, undefined);
        this.event.trigger(Event.PROCESS_UPDATE, req.user, process);
        return process;
    }
}

