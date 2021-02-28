import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EditRoleDto } from 'src/dto/role/editRoleDto';
import { Permission, Role } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CompaniesGuard } from '../companies/companies.guard';
import { RolesService } from './roles.service';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompaniesGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {
    }

    @ApiOkResponse({ type: [Role] })
    @ApiQuery({ name: 'companyId', required: false })
    @Permissions(Permission.VIEW)
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.rolesService.getAll(filter);
    }

    @ApiOkResponse({ type: Role })
    @Permissions(Permission.EDIT)
    @Post()
    create(@Request() req: { user: User }, @Body() editRoleDto: EditRoleDto) {
        return this.rolesService.create(editRoleDto, req.user);
    }

    @ApiOkResponse({ type: Role })
    @Permissions(Permission.VIEW)
    @Get(':roleId')
    getById(@Param('roleId', new ParseIdPipe()) roleId: string) {
        let role = this.rolesService.getById(roleId);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }

    @ApiOkResponse({ type: Role })
    @Permissions(Permission.EDIT)
    @Put(':roleId')
    edit(@Param('roleId', new ParseIdPipe()) roleId: string, @Body() editRoleDto: EditRoleDto) {
        let role = this.rolesService.edit(roleId, editRoleDto);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }

    @ApiOkResponse()
    @Permissions(Permission.EDIT)
    @Delete(':roleId')
    delete(@Param('roleId', new ParseIdPipe()) roleId: string) {
        let role = this.rolesService.delete(roleId);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }
}
