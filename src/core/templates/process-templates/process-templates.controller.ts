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
    @Get(':processTemplateId')
    getById(@Param('processTemplateId') processTemplateId: string) {
        let processTemplate = this.processService.getById(processTemplateId);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Put(':processTemplateId')
    edit(@Param('processTemplateId') processTemplateId: string, @Body() editProcessTemplateDto: EditProcessTemplateDto) {
        let processTemplate = this.processService.edit(processTemplateId, editProcessTemplateDto);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }

    @ApiOkResponse()
    @Delete(':processTemplateId')
    delete(@Param('processTemplateId') processTemplateId: string) {
        let processTemplate = this.processService.delete(processTemplateId);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }
}
