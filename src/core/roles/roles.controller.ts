import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EditRoleDto } from 'src/dto/role/editRole.dto';
import { ApplyDocumentMetadata } from 'src/interceptors/document-metadata/apply-document-metadata.decorator';
import { DocumentMetadataType } from 'src/interceptors/document-metadata/document-metadata';
import { DocumentMetadata } from 'src/interceptors/document-metadata/document-metadata.decorator';
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
@ApplyDocumentMetadata(RolesService)
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
    @DocumentMetadata(DocumentMetadataType.CREATED_AT, DocumentMetadataType.CREATED_BY)
    @Post()
    create(@Account() user: User, @Body() editRoleDto: EditRoleDto) {
        return this.rolesService.create(editRoleDto, user);
    }

    @ApiOkResponse({ type: Role })
    @Permissions(Permission.ROLE_VIEW)
    @Get(':roleId')
    async getById(@Param('roleId', new ParseIdPipe()) roleId: string) {
        const role = await this.rolesService.getById(roleId);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }

    @ApiOkResponse({ type: Role })
    @Permissions(Permission.ROLE_EDIT)
    @DocumentMetadata(DocumentMetadataType.EDITED_AT, DocumentMetadataType.EDITED_BY)
    @Put(':roleId')
    edit(@Param('roleId', new ParseIdPipe()) roleId: string, @Body() editRoleDto: EditRoleDto) {
        const role = this.rolesService.edit(roleId, editRoleDto);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }

    @ApiOkResponse()
    @Permissions(Permission.ROLE_EDIT)
    @DocumentMetadata(DocumentMetadataType.DELETED_AT, DocumentMetadataType.DELETED_BY)
    @Delete(':roleId')
    async delete(@Param('roleId', new ParseIdPipe()) roleId: string) {
        //TODO harddelete const role = this.rolesService.delete(roleId);
        const role = await this.rolesService.getById(roleId);
        if (role == null) throw new NotFoundException('Role not found!');
        return role;
    }
}
