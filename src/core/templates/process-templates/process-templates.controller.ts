import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Account } from 'src/core/auth/account.decorator';
import { Permissions } from 'src/core/auth/permissions.decorator';
import { PermissionsGuard } from 'src/core/auth/permissions.guard';
import { UserAuthGuard } from 'src/core/auth/user-auth.guard';
import { EditProcessTemplateDto } from 'src/dto/processTemplate/editProcessTemplate.dto';
import { ApplyDocumentMetadata } from 'src/interceptors/document-metadata/apply-document-metadata.decorator';
import { DocumentMetadataType } from 'src/interceptors/document-metadata/document-metadata';
import { DocumentMetadata } from 'src/interceptors/document-metadata/document-metadata.decorator';
import { ProcessTemplate } from 'src/models/processTemplate';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { ProcessTemplatesService } from './process-templates.service';

@ApiTags('process-templates')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@ApplyDocumentMetadata(ProcessTemplatesService)
@Controller('templates/process')
export class ProcessTemplatesController {
    constructor(private processService: ProcessTemplatesService) {
    }

    @Permissions(Permission.TEMPLATE_VIEW)
    @Get('search')
    search(@Account() user: User, @Query('limit', ParseIntPipe) limit: number, @Query('name') name: string) {
        return this.processService.search({ companyId: user.companyId, name, limit });
    }

    @ApiOkResponse({ type: [ProcessTemplate] })
    @ApiQuery({ name: 'companyId', required: false })
    @Permissions(Permission.TEMPLATE_VIEW)
    @Get()
    getAll(@Account() user: User) {
        return this.processService.getAll({ companyId: user.companyId });
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Permissions(Permission.TEMPLATE_EDIT)
    @DocumentMetadata(DocumentMetadataType.CREATED_AT, DocumentMetadataType.CREATED_BY)
    @Post()
    create(@Account() user: User, @Body() editProcessDto: EditProcessTemplateDto) {
        return this.processService.create(editProcessDto, user);
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Permissions(Permission.TEMPLATE_VIEW)
    @Get(':templateId')
    async getById(@Param('templateId', new ParseIdPipe()) templateId: string) {
        const processTemplate = await this.processService.getById(templateId);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }

    @ApiOkResponse({ type: ProcessTemplate })
    @Permissions(Permission.TEMPLATE_EDIT)
    @DocumentMetadata(DocumentMetadataType.EDITED_AT, DocumentMetadataType.EDITED_BY)
    @Put(':templateId')
    async edit(@Param('templateId', new ParseIdPipe()) templateId: string, @Body() editProcessTemplateDto: EditProcessTemplateDto) {
        const processTemplate = await this.processService.edit(templateId, editProcessTemplateDto);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }

    @ApiOkResponse()
    @Permissions(Permission.TEMPLATE_EDIT)
    @DocumentMetadata(DocumentMetadataType.DELETED_AT, DocumentMetadataType.DELETED_BY)
    @Delete(':templateId')
    async delete(@Param('templateId', new ParseIdPipe()) templateId: string) {
        //TODO harddelete const processTemplate = this.processService.delete(templateId);
        const processTemplate = await this.processService.getById(templateId);
        if (processTemplate == null) throw new NotFoundException('Process template not found!');
        return processTemplate;
    }
}
