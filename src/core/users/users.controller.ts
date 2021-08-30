import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { filter } from 'rxjs/operators';
import { CreateUserDto } from 'src/dto/user/createUserDto';
import { EditUserDto } from 'src/dto/user/editUserDto';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { RolesService } from '../roles/roles.service';
import { Account } from './../auth/account.decorator';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private rolesService: RolesService
    ) {
    }

    @ApiOkResponse({ type: [User] })
    @Permissions(Permission.USER_VIEW)
    @Get()
    async getAll(@Account() user: User, @Query() filter: { email: string, permissions: Permission[] }) {
        const { email, permissions } = filter;
        const { companyId } = user;

        if (permissions) {
            const roles = await this.rolesService.getAll(companyId, permissions);
            return this.usersService.getAll(companyId, roles);
        }

        return this.usersService.getAll(companyId);
    }

    @ApiOkResponse({ type: User })
    @Permissions(Permission.USER_EDIT)
    @Post()
    async create(@Account() user: User, @Body() creatUserDto: CreateUserDto) {
        const search = await this.usersService.getByEmail(creatUserDto.email);
        if (search != null) throw new BadRequestException('Email already taken!');
        creatUserDto.companyId = user.companyId;
        return this.usersService.create(creatUserDto);
    }

    @ApiOkResponse({ type: [User] })
    @Get('me')
    getMe(@Account() user: User) {
        return user;
    }

    @ApiOkResponse({ type: User })
    @Permissions(Permission.USER_VIEW)
    @Get(':userId')
    getById(@Param('userId', new ParseIdPipe()) userId: string) {
        const user = this.usersService.getById(userId);
        if (user == null) throw new NotFoundException('User not found!');
        return user;
    }

    @ApiOkResponse({ type: User })
    @Permissions(Permission.USER_EDIT)
    @Put(':userId')
    edit(@Param('userId', new ParseIdPipe()) userId: string, @Body() editUserDto: EditUserDto) {
        const user = this.usersService.edit(userId, editUserDto);
        if (user == null) throw new NotFoundException('User not found!');
        return user;
    }

    @ApiOkResponse()
    @Permissions(Permission.USER_EDIT)
    @Delete(':userId')
    delete(@Param('userId', new ParseIdPipe()) userId: string) {
        const user = this.usersService.delete(userId);
        if (user == null) throw new NotFoundException('User not found!');
        return user;
    }
}
