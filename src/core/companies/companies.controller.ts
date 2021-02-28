import { Controller, Get, Post, Body, Param, NotFoundException, Patch, Delete, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Company } from 'src/models/company.model';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from 'src/dto/company/createCompanyDto';
import { EditCompanyDto } from 'src/dto/company/editCompanyDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';
import { PermissionsGuard } from '../auth/permissions.guard';

@ApiTags('companies')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('companies')
export class CompaniesController {

    constructor(private companyService: CompaniesService) {
    }

    @ApiOkResponse({ type: [Company] })
    @Get()
    getAll() {
        return this.companyService.getAll();
    }

    @ApiOkResponse({ type: Company })
    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @ApiOkResponse({ type: Company })
    @Get(':companyId')
    getById(@Param('companyId', new ParseIdPipe()) companyId: string) {
        let company = this.companyService.getById(companyId);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }

    @ApiOkResponse({ type: Company })
    @Put(':companyId')
    edit(@Param('companyId', new ParseIdPipe()) companyId: string, @Body() editCompanyDto: EditCompanyDto) {
        let company = this.companyService.edit(companyId, editCompanyDto);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }

    @ApiOkResponse()
    @Delete(':companyId')
    delete(@Param('companyId', new ParseIdPipe()) companyId: string) {
        let company = this.companyService.delete(companyId);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }
}
