import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from 'src/dto/company/createCompanyDto';
import { EditCompanyDto } from 'src/dto/company/editCompanyDto';
import { Company } from 'src/models/company.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { CompaniesService } from './companies.service';

@ApiTags('companies')
@UseGuards(PermissionsGuard)
@Controller('companies')
export class CompaniesController {

    constructor(private companyService: CompaniesService) {
    }

    @ApiOkResponse({ type: [Company] })
    @UseGuards(AdminAuthGuard)
    @Get()
    getAll() {
        return this.companyService.getAll();
    }

    @ApiOkResponse({ type: Company })
    @UseGuards(AdminAuthGuard)
    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @ApiOkResponse({ type: Company })
    @UseGuards(UserAuthGuard)
    @Get(':companyId')
    getById(@Param('companyId', new ParseIdPipe()) companyId: string) {
        const company = this.companyService.getById(companyId);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }

    @ApiOkResponse({ type: Company })
    @UseGuards(AdminAuthGuard)
    @Put(':companyId')
    edit(@Param('companyId', new ParseIdPipe()) companyId: string, @Body() editCompanyDto: EditCompanyDto) {
        const company = this.companyService.edit(companyId, editCompanyDto);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }

    @ApiOkResponse()
    @UseGuards(AdminAuthGuard)
    @Delete(':companyId')
    delete(@Param('companyId', new ParseIdPipe()) companyId: string) {
        const company = this.companyService.delete(companyId);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }
}
