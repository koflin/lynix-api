import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { filter } from 'rxjs/operators';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/dto/user/createUserDto';
import { EditUserDto } from 'src/dto/user/editUserDto';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CompaniesGuard } from '../companies/companies.guard';
import { RolesService } from '../roles/roles.service';
import { Requestor } from './requestor.decorator';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompaniesGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private rolesService: RolesService
    ) {
    }

    @ApiOkResponse({ type: [User] })
    @Permissions(Permission.VIEW)
    @Get()
    async getAll(@Requestor() user: User, @Query() filter: { username: string, permissions: Permission[] }) {
        const { username, permissions } = filter;
        const { companyId } = user;

        if (permissions) {
            const roles = await this.rolesService.getAll(companyId, permissions);
            return this.usersService.getAll(companyId, roles);
        }

        return this.usersService.getAll(companyId);
    }

    @ApiOkResponse({ type: User })
    @Permissions(Permission.EDIT)
    @Post()
    create(@Request() req: { user: User }, @Body() creatUserDto: CreateUserDto) {
        creatUserDto.companyId = req.user.companyId;
        return this.usersService.create(creatUserDto);
    }

    @ApiOkResponse({ type: [User] })
    @Get('me')
    getMe(@Request() req: { user: User }) {
        return req.user;
    }

    @ApiOkResponse({ type: User })
    @Permissions(Permission.VIEW)
    @Get(':userId')
    getById(@Param('userId', new ParseIdPipe()) userId: string) {
        let user = this.usersService.getById(userId);
        if (user == null) throw new NotFoundException('User not found!');
        return user;
    }

    @ApiOkResponse({ type: User })
    @Permissions(Permission.EDIT)
    @Put(':userId')
    edit(@Param('userId', new ParseIdPipe()) userId: string, @Body() editUserDto: EditUserDto) {
        let user = this.usersService.edit(userId, editUserDto);
        if (user == null) throw new NotFoundException('User not found!');
        return user;
    }

    @ApiOkResponse()
    @Permissions(Permission.EDIT)
    @Delete(':userId')
    delete(@Param('userId', new ParseIdPipe()) userId: string) {
        let user = this.usersService.delete(userId);
        if (user == null) throw new NotFoundException('User not found!');
        return user;
    }
}
