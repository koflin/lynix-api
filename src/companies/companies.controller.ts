import { Controller, Get, Post, Body, Param, NotFoundException, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Company } from 'src/models/company.model';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from 'src/dto/createCompanyDto';
import { EditCompanyDto } from 'src/dto/editCompanyDto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {

    constructor(private companyService: CompaniesService) {
    }

    @ApiOkResponse({ type: Company })
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
    getById(@Param('companyId') companyId: string) {
        let company = this.companyService.getById(companyId);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }

    @ApiOkResponse({ type: Company })
    @Patch(':companyId')
    edit(@Param('companyId') companyId: string, @Body() editCompanyDto: EditCompanyDto) {
        let company = this.companyService.edit(companyId, editCompanyDto);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }

    @ApiOkResponse()
    @Delete(':companyId')
    delete(@Param('companyId') companyId: string) {
        let company = this.companyService.delete(companyId);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }
}
