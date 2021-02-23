import { EditProcessDto } from './../../dto/process/editProcessDto';
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { CreateProcessDto } from 'src/dto/process/createProcessDto';
import { Process } from 'src/models/process.model';
import { ProcessesService } from './processes.service';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('processes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('processes')
export class ProcessesController {
    constructor(
        private processesService: ProcessesService
    ) { }

    @ApiOkResponse({ type: [Process] })
    @ApiQuery({ name: 'companyId', required: false })
    @ApiQuery({ name: 'assignedUserId', required: false })
    @ApiQuery({ name: 'orderId', required: false })
    @Get()
    getAll(@Query() filter: { companyId: string, assignedUserId: string, orderId: string }) {
        return this.processesService.getAll(filter);
    }

    @ApiOkResponse({ type: Process })
    @Get(':processId')
    getById(@Param('processId') processId: string) {
        let process = this.processesService.getById(processId);
        if (process == null) throw new NotFoundException('Process not found!');
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Post()
    async create(@Request() req: { user: User }, @Body() createProcessDto: CreateProcessDto) {
        let process = await this.processesService.create(createProcessDto, req.user);
        if (process == null) throw new NotFoundException('Template not found!');
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Put(':processId')
    async edit(@Param('processId', new ParseIdPipe()) processId: string, @Body() editProcessDto: EditProcessDto) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        let process = await this.processesService.edit(processId, editProcessDto);
        return process;
    }

    @ApiOkResponse()
    @Delete(':processId')
    async delete(@Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.delete(processId);
    }

    @ApiOkResponse()
    @Put(':processId/start')
    async start(@Param('processId', new ParseIdPipe()) processId: string, @Body('userId') userId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.start(processId, userId);
    }

    @ApiOkResponse()
    @Put(':processId/stop')
    async stop(@Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.stop(processId);
    }

    @ApiOkResponse()
    @Put(':processId/assign')
    async assign(@Param('processId', new ParseIdPipe()) processId: string, @Body('assigneeId') assigneeId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.assign(processId, assigneeId);
    }

    @ApiOkResponse()
    @Put(':processId/finish')
    async finish(@Param('processId', new ParseIdPipe()) processId: string) {
        if (!await this.processesService.exists(processId)) throw new NotFoundException('Process not found!');
        return this.processesService.finish(processId, undefined);
    }
}

