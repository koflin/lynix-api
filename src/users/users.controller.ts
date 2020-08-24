import { Controller, Get, Post, Body, Delete, Put, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from 'src/models/user.model';
import { CreateUserDto } from 'src/dto/user/createUserDto';
import { EditUserDto } from 'src/dto/user/editUserDto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    @ApiOkResponse({ type: [User] })
    @ApiQuery({ name: 'companyId', required: false })
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.usersService.getAll(filter);
    }

    @ApiOkResponse({ type: User })
    @Post()
    create(@Body() creatUserDto: CreateUserDto) {
        return this.usersService.create(creatUserDto);
    }

    @ApiOkResponse({ type: User })
    @Get(':userId')
    getById(@Param('userId') userId: string) {
        let user = this.usersService.getById(userId);
        if (user == null) throw new NotFoundException('User not found!');
        return user;
    }

    @ApiOkResponse({ type: User })
    @Put(':userId')
    edit(@Param('userId') userId: string, @Body() editUserDto: EditUserDto) {
        let user = this.usersService.edit(userId, editUserDto);
        if (user == null) throw new NotFoundException('User not found!');
        return user;
    }

    @ApiOkResponse()
    @Delete(':userId')
    delete(@Param('userId') userId: string) {
        let user = this.usersService.delete(userId);
        if (user == null) throw new NotFoundException('User not found!');
        return user;
    }
}
