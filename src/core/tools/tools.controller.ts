import { ToolsService } from './tools.service';
import { Tool } from './../../models/tool.model';
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesGuard } from '../companies/companies.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from 'src/models/role.model';

@ApiTags('tools')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompaniesGuard, PermissionsGuard)
@Controller('tools')
export class ToolsController {
    constructor(private toolsService: ToolsService) {
    }

    @ApiOkResponse({ type: [Tool] })
    @Permissions(Permission.VIEW)
    @Get()
    getAll() {
        return this.toolsService.getAll();
    }

    @ApiOkResponse({ type: Tool })
    @Permissions(Permission.EDIT)
    @Post()
    create(@Body() createDto: any) {
        return this.toolsService.create(createDto);
    }

    @ApiOkResponse({ type: Tool })
    @Permissions(Permission.VIEW)
    @Get(':toolId')
    getById(@Param('toolId', new ParseIdPipe()) toolId: string) {
        let tool = this.toolsService.getById(toolId);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }

    @ApiOkResponse({ type: Tool })
    @Permissions(Permission.EDIT)
    @Put(':toolId')
    edit(@Param('toolId', new ParseIdPipe()) toolId: string, @Body() editDto: any) {
        let tool = this.toolsService.edit(toolId, editDto);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }

    @ApiOkResponse()
    @Permissions(Permission.EDIT)
    @Delete(':toolId')
    delete(@Param('toolId', new ParseIdPipe()) toolId: string) {
        let tool = this.toolsService.delete(toolId);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }
}
