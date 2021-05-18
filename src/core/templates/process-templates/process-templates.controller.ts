import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Account } from 'src/core/auth/account.decorator';
import { Permissions } from 'src/core/auth/permissions.decorator';
import { PermissionsGuard } from 'src/core/auth/permissions.guard';
import { UserAuthGuard } from 'src/core/auth/user-auth.guard';
import { EditProcessTemplateDto } from 'src/dto/processTemplate/editProcessTemplateDto';
import { ProcessTemplate } from 'src/models/processTemplate';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { ProcessTemplatesService } from './process-templates.service';

@ApiTags('process-templates')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('templates/process')
export class ProcessTemplatesController {
    constructor(private processService: ProcessTemplatesService) {
    }

    @ApiOkResponse({ type: [ProcessTemplate] })
    @ApiQuery({ name: 'companyId', required: false })
    @Permissions(Permission.VIEW)
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.processService.getAll(filter);
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Permissions(Permission.EDIT)
    @Post()
    create(@Account() user: User, @Body() editProcessDto: EditProcessTemplateDto) {
        return this.processService.create(editProcessDto, user);
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Permissions(Permission.VIEW)
    @Get(':templateId')
    getById(@Param('templateId', new ParseIdPipe()) templateId: string) {
        let processTemplate = this.processService.getById(templateId);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Permissions(Permission.EDIT)
    @Put(':templateId')
    edit(@Param('templateId', new ParseIdPipe()) templateId: string, @Body() editProcessTemplateDto: EditProcessTemplateDto) {
        let processTemplate = this.processService.edit(templateId, editProcessTemplateDto);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }

    @ApiOkResponse()
    @Permissions(Permission.EDIT)
    @Delete(':templateId')
    delete(@Param('templateId', new ParseIdPipe()) templateId: string) {
        let processTemplate = this.processService.delete(templateId);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }
}
