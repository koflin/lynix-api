import { Controller, Get, Post, Body, Delete, Put, Param, Query, NotFoundException, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from 'src/models/user.model';
import { CreateUserDto } from 'src/dto/user/createUserDto';
import { EditUserDto } from 'src/dto/user/editUserDto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';
import { CompaniesGuard } from '../companies/companies.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from 'src/models/role.model';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompaniesGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    @ApiOkResponse({ type: [User] })
    @ApiQuery({ name: 'companyId', required: false })
    @Permissions(Permission.VIEW)
    @Get()
    getAll(@Query() filter: { companyId: string, username: string, permissions: string[] }) {
        if (filter.username) {
            return this.usersService.getByUsername(filter.username);
        }

        return this.usersService.getAll(filter);
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
