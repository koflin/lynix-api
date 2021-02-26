import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EditRoleDto } from 'src/dto/role/editRoleDto';
import { Role } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesService } from './roles.service';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {
    }

    @ApiOkResponse({ type: [Role] })
    @ApiQuery({ name: 'companyId', required: false })
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.rolesService.getAll(filter);
    }

    @ApiOkResponse({ type: Role })
    @Post()
    create(@Request() req: { user: User }, @Body() editRoleDto: EditRoleDto) {
        return this.rolesService.create(editRoleDto, req.user);
    }

    @ApiOkResponse({ type: Role })
    @Get(':roleId')
    getById(@Param('roleId', new ParseIdPipe()) roleId: string) {
        let role = this.rolesService.getById(roleId);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }

    @ApiOkResponse({ type: Role })
    @Put(':roleId')
    edit(@Param('roleId', new ParseIdPipe()) roleId: string, @Body() editRoleDto: EditRoleDto) {
        let role = this.rolesService.edit(roleId, editRoleDto);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }

    @ApiOkResponse()
    @Delete(':roleId')
    delete(@Param('roleId', new ParseIdPipe()) roleId: string) {
        let role = this.rolesService.delete(roleId);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }
}
