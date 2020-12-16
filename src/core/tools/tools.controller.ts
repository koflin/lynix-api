import { ToolsService } from './tools.service';
import { Tool } from './../../models/tool.model';
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tools')
@ApiBearerAuth()
@Controller('tools')
export class ToolsController {
    constructor(private toolsService: ToolsService) {
    }

    @ApiOkResponse({ type: [Tool] })
    @Get()
    getAll() {
        return this.toolsService.getAll();
    }

    @ApiOkResponse({ type: Tool })
    @Post()
    create(@Body() createDto: any) {
        return this.toolsService.create(createDto);
    }

    @ApiOkResponse({ type: Tool })
    @Get(':toolId')
    getById(@Param('toolId') toolId: string) {
        let tool = this.toolsService.getById(toolId);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }

    @ApiOkResponse({ type: Tool })
    @Put(':toolId')
    edit(@Param('toolId') toolId: string, @Body() editDto: any) {
        let tool = this.toolsService.edit(toolId, editDto);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }

    @ApiOkResponse()
    @Delete(':toolId')
    delete(@Param('toolId') toolId: string) {
        let tool = this.toolsService.delete(toolId);
        if (tool == null) throw new NotFoundException('Tool not found!');
        return tool;
    }
}
