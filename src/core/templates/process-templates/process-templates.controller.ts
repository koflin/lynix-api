import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EditProcessTemplateDto } from 'src/dto/processTemplate/editProcessTemplateDto';
import { ProcessTemplate } from 'src/models/processTemplate';
import { ProcessTemplatesService } from './process-templates.service';

@ApiTags('process-templates')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard)
@Controller('templates/process')
export class ProcessTemplatesController {
    constructor(private processService: ProcessTemplatesService) {
    }

    @ApiOkResponse({ type: [ProcessTemplate] })
    @ApiQuery({ name: 'companyId', required: false })
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.processService.getAll(filter);
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Post()
    create(@Body() editProcessDto: EditProcessTemplateDto) {
        return this.processService.create(editProcessDto);
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Get(':templateId')
    getById(@Param('templateId') templateId: string) {
        let processTemplate = this.processService.getById(templateId);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Put(':templateId')
    edit(@Param('templateId') templateId: string, @Body() editProcessTemplateDto: EditProcessTemplateDto) {
        let processTemplate = this.processService.edit(templateId, editProcessTemplateDto);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }

    @ApiOkResponse()
    @Delete(':templateId')
    delete(@Param('templateId') templateId: string) {
        let processTemplate = this.processService.delete(templateId);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }
}
