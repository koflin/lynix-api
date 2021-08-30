import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Permission } from 'src/models/role.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { Tool } from './../../models/tool.model';
import { ToolsService } from './tools.service';

@ApiTags('tools')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('tools')
export class ToolsController {
    constructor(private toolsService: ToolsService) {
    }

    @ApiOkResponse({ type: [Tool] })
    @Permissions(Permission.PROCESS_VIEW, Permission.TEMPLATE_VIEW)
    @Get()
    getAll() {
        return this.toolsService.getAll();
    }

    @ApiOkResponse({ type: Tool })
    @Permissions(Permission.TOOL_EDIT)
    @Post()
    create(@Body() createDto: any) {
        return this.toolsService.create(createDto);
    }

    @ApiOkResponse({ type: Tool })
    @Permissions(Permission.PROCESS_VIEW, Permission.TEMPLATE_VIEW)
    @Get(':toolId')
    getById(@Param('toolId', new ParseIdPipe()) toolId: string) {
        const tool = this.toolsService.getById(toolId);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }

    @ApiOkResponse({ type: Tool })
    @Permissions(Permission.TOOL_EDIT)
    @Put(':toolId')
    edit(@Param('toolId', new ParseIdPipe()) toolId: string, @Body() editDto: any) {
        const tool = this.toolsService.edit(toolId, editDto);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }

    @ApiOkResponse()
    @Permissions(Permission.TOOL_EDIT)
    @Delete(':toolId')
    delete(@Param('toolId', new ParseIdPipe()) toolId: string) {
        const tool = this.toolsService.delete(toolId);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }
}
