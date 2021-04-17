import { BadRequestException, Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { LocalUser } from 'src/models/localUser.model';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CompaniesGuard } from '../companies/companies.guard';
import { CompanyProtect } from '../companies/company-protect.decorator';
import { Requestor } from '../users/requestor.decorator';
import { ActivationService } from './activation.service';

@UseGuards(CompaniesGuard, PermissionsGuard)
@Controller('activation')
export class ActivationController {

    constructor(
        private activationService: ActivationService
    ) {

    }

    @Get(':userId')
    get(@Param('userId') userId) {
        return this.activationService.getByUserId(userId);
    }

    @Put(':id')
    async activate(@Param('id') id, @Body() data: { code: string, password: string }) {
        const result = await this.activationService.activate(id, data.code, data.password);
        if (!result) throw new BadRequestException('Could not activate user');
        return;
    }

    @UseGuards(JwtAuthGuard)
    @CompanyProtect('userId')
    @Post()
    async create(@Requestor() user: LocalUser, @Body('userId') userId) {
        return this.activationService.create(userId, user.companyId);
    }
}