import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { Permission } from 'src/models/role.model';

import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { ActivationService } from './activation.service';

@Controller('activation')
export class ActivationController {

    constructor(
        private activationService: ActivationService
    ) {

    }

    @UseGuards(UserAuthGuard, PermissionsGuard)
    @Permissions(Permission.EDIT)
    @Get()
    search(@Query('userId') userId) {
        return this.activationService.getByUserId(userId);
    }

    @Post('verify/:id')
    async verify(@Param('id') id, @Body() data: { code: string }) {
        const userId = await this.activationService.verify(id, data.code);
        if (!userId) throw new NotFoundException();
        return { userId };
    }

    @Post('activate/:id')
    async activate(@Param('id') id, @Body() data: { code: string, password: string }) {
        const result = await this.activationService.activate(id, data.code, data.password);
        if (!result) throw new BadRequestException('Could not activate user');
        return;
    }

    @Post()
    async create(@Body('userId') userId) {
        if (!await this.activationService.create(userId, 'reset')) throw new BadRequestException('Could not create activation!');
        return;
    }
}
