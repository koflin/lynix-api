import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { EditProcessDto } from 'src/dto/process/editProcessDto';
import { Process } from 'src/models/process.model';
import { ProcessesService } from './processes.service';

@ApiTags('processes')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@Controller('processes')
export class ProcessesController {
    constructor(
        private processesService: ProcessesService
    ) { }

    @ApiOkResponse({ type: [Process] })
    @ApiQuery({ name: 'companyId', required: false })
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.processesService.getAll(filter);
    }

    @ApiOkResponse({ type: Process })
    @Post()
    create(@Body() editProcessDto: EditProcessDto) {
        return this.processesService.create(editProcessDto);
    }

    @ApiOkResponse({ type: Process })
    @Get(':processId')
    getById(@Param('processId') processId: string) {
        let process = this.processesService.getById(processId);
        if (process == null) throw new NotFoundException('Process not found!');
        return process;
    }

    @ApiOkResponse({ type: Process })
    @Put(':processId')
    edit(@Param('processId') processId: string, @Body() editProcessDto: EditProcessDto) {
        let process = this.processesService.edit(processId, editProcessDto);
        if (process == null) throw new NotFoundException('Process not found!');
        return process;
    }

    @ApiOkResponse()
    @Delete(':processId')
    delete(@Param('processId') processId: string) {
        let process = this.processesService.delete(processId);
        if (process == null) throw new NotFoundException('Process not found!');
        return process;
    }
}

