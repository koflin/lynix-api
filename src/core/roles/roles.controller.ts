import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EditRoleDto } from 'src/dto/role/editRoleDto';
import { Permission, Role } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { Account } from '../auth/account.decorator';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { RolesService } from './roles.service';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {
    }

    @ApiOkResponse({ type: [Role] })
    @Permissions(Permission.ROLE_VIEW)
    @Get()
    getAll(@Account() user: User) {
        return this.rolesService.getAll(user.companyId);
    }

    @ApiOkResponse({ type: Role })
    @Permissions(Permission.ROLE_EDIT)
    @Post()
    create(@Account() user: User, @Body() editRoleDto: EditRoleDto) {
        return this.rolesService.create(editRoleDto, user);
    }

    @ApiOkResponse({ type: Role })
    @Permissions(Permission.ROLE_VIEW)
    @Get(':roleId')
    getById(@Param('roleId', new ParseIdPipe()) roleId: string) {
        const role = this.rolesService.getById(roleId);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }

    @ApiOkResponse({ type: Role })
    @Permissions(Permission.ROLE_EDIT)
    @Put(':roleId')
    edit(@Param('roleId', new ParseIdPipe()) roleId: string, @Body() editRoleDto: EditRoleDto) {
        const role = this.rolesService.edit(roleId, editRoleDto);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }

    @ApiOkResponse()
    @Permissions(Permission.ROLE_EDIT)
    @Delete(':roleId')
    delete(@Param('roleId', new ParseIdPipe()) roleId: string) {
        const role = this.rolesService.delete(roleId);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }
}
