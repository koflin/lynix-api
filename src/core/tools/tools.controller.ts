import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApplyDocumentMetadata } from 'src/interceptors/document-metadata/apply-document-metadata.decorator';
import { DocumentMetadataType } from 'src/interceptors/document-metadata/document-metadata';
import { DocumentMetadata } from 'src/interceptors/document-metadata/document-metadata.decorator';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { Account } from '../auth/account.decorator';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { Tool } from './../../models/tool.model';
import { ToolsService } from './tools.service';

@ApiTags('tools')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@ApplyDocumentMetadata(ToolsService)
@Controller('tools')
export class ToolsController {
    constructor(private toolsService: ToolsService) {
    }

    @ApiOkResponse({ type: [Tool] })
    @Permissions(Permission.PROCESS_VIEW, Permission.TEMPLATE_VIEW)
    @Get()
    getAll(@Account() user: User) {
        return this.toolsService.getAll(user.companyId);
    }

    @ApiOkResponse({ type: Tool })
    @Permissions(Permission.TOOL_EDIT)
    @DocumentMetadata(DocumentMetadataType.CREATED_AT, DocumentMetadataType.CREATED_BY)
    @Post()
    create(@Body() createDto: any) {
        return this.toolsService.create(createDto);
    }

    @ApiOkResponse({ type: Tool })
    @Permissions(Permission.PROCESS_VIEW, Permission.TEMPLATE_VIEW)
    @Get(':toolId')
    async getById(@Param('toolId', new ParseIdPipe()) toolId: string) {
        const tool = await this.toolsService.getById(toolId);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }

    @ApiOkResponse({ type: Tool })
    @Permissions(Permission.TOOL_EDIT)
    @DocumentMetadata(DocumentMetadataType.EDITED_AT, DocumentMetadataType.EDITED_BY)
    @Put(':toolId')
    async edit(@Param('toolId', new ParseIdPipe()) toolId: string, @Body() editDto: any) {
        const tool = await this.toolsService.edit(toolId, editDto);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }

    @ApiOkResponse()
    @Permissions(Permission.TOOL_EDIT)
    @DocumentMetadata(DocumentMetadataType.DELETED_AT, DocumentMetadataType.DELETED_BY)
    @Delete(':toolId')
    async delete(@Param('toolId', new ParseIdPipe()) toolId: string) {
        // TODO hard delete const tool = this.toolsService.delete(toolId);
        const tool = await this.toolsService.getById(toolId);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }
}
