import { Permissions } from '../auth/permissions.decorator';
import { EditProcessDto } from './../../dto/process/editProcessDto';
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { CreateProcessDto } from 'src/dto/process/createProcessDto';
import { Process } from 'src/models/process.model';
import { ProcessesService } from './processes.service';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesGuard } from '../companies/companies.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permission } from 'src/models/role.model';

@ApiTags('processes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompaniesGuard, PermissionsGuard)
@Controller('processes')
export class ProcessesController {
    constructor(
        private processesService: ProcessesService
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
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Permissions(Permission.EDIT)
    @Put(':processId')
    async edit(@Param('processId', new ParseIdPipe()) processId: string, @Body() editProcessDto: EditProcessDto) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        let process = await this.processesService.edit(processId, editProcessDto);
        return process;
    }

    @ApiOkResponse()
    @Permissions(Permission.EDIT)
    @Delete(':processId')
    async delete(@Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.delete(processId);
    }
    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Put(':processId/enter')
    async enter(@Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.enter(processId);
    }

    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Put(':processId/exit')
    async exit(@Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.exit(processId);
    }

    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Put(':processId/start')
    async start(@Param('processId', new ParseIdPipe()) processId: string, @Body('userId') userId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.start(processId, userId);
    }

    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Put(':processId/stop')
    async stop(@Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.stop(processId);
    }

    @ApiOkResponse()
    @Permissions(Permission.EDIT)
    @Put(':processId/assign')
    async assign(@Param('processId', new ParseIdPipe()) processId: string, @Body('assigneeId') assigneeId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.assign(processId, assigneeId);
    }

    @ApiOkResponse()
    @Permissions(Permission.EXECUTE)
    @Put(':processId/finish')
    async finish(@Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.finish(processId, undefined);
    }
}

