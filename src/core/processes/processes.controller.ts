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
import { CreateProcessDto } from 'src/dto/process/createProcess.dto';
import { ApplyDocumentMetadata } from 'src/interceptors/document-metadata/apply-document-metadata.decorator';
import { DocumentMetadataType } from 'src/interceptors/document-metadata/document-metadata';
import { DocumentMetadata } from 'src/interceptors/document-metadata/document-metadata.decorator';
import { Process } from 'src/models/process.model';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { EditProcessDto } from '../../dto/process/editProcess.dto';
import { Account } from '../auth/account.decorator';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { EventGateway } from '../event/event.gateway';
import { Event } from '../event/event.model';
import { ProcessesService } from './processes.service';

@ApiTags('processes')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@ApplyDocumentMetadata(ProcessesService)
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
    getAll(@Account() user: User, @Query() filter: { assignedUserId: string, orderId: string }) {
        return this.processesService.getAll({
            assignedUserId: filter.assignedUserId,
            orderId: filter.orderId,
            offset: 0,
            limit: 0
        }, user.companyId);
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.PROCESS_VIEW)
    @Get(':processId')
    async getById(@Param('processId') processId: string) {
        const process = await this.processesService.getById(processId);
        if (process == null) throw new NotFoundException('Process not found!');
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.ORDER_EDIT)
    @DocumentMetadata(DocumentMetadataType.CREATED_AT, DocumentMetadataType.CREATED_BY)
    @Post()
    async create(@Account() user: User, @Body() createProcessDto: CreateProcessDto) {
        const process = await this.processesService.create(createProcessDto, user);
        if (process == null) throw new NotFoundException('Template not found!');
        this.event.triggerOther(Event.PROCESS_CREATE, user, process);
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.ORDER_EDIT)
    @DocumentMetadata(DocumentMetadataType.EDITED_AT, DocumentMetadataType.EDITED_BY)
    @Put(':processId')
    async edit(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string, @Body() editProcessDto: EditProcessDto) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        const process = await this.processesService.edit(processId, editProcessDto);
        this.event.triggerOther(Event.PROCESS_UPDATE, user, process);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.ORDER_EDIT)
    @DocumentMetadata(DocumentMetadataType.DELETED_AT, DocumentMetadataType.DELETED_BY)
    @Delete(':processId')
    async delete(@Account() user: User, @Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        this.event.triggerOther(Event.PROCESS_DELETE, user, processId);
        // TODO harddelete return this.processesService.delete(processId);
        return this.processesService.getById(processId);
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
        if (process.occupiedById) throw new ForbiddenException('Process occupied!');

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

