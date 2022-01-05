import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateCompanyDto } from 'src/dto/company/createCompany.dto';
import { EditCompanyDto } from 'src/dto/company/editCompany.dto';
import { ApplyDocumentMetadata } from 'src/interceptors/document-metadata/apply-document-metadata.decorator';
import { DocumentMetadataType } from 'src/interceptors/document-metadata/document-metadata';
import { DocumentMetadata } from 'src/interceptors/document-metadata/document-metadata.decorator';
import { Company } from 'src/models/company.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { UserAuthGuard } from '../auth/user-auth.guard';
import { CompaniesService } from './companies.service';

@ApiTags('companies')
@UseGuards(PermissionsGuard)
@ApplyDocumentMetadata(CompaniesService)
@Controller('companies')
export class CompaniesController {

    constructor(
        private companyService: CompaniesService
    ) {
    }

    @ApiOkResponse({ type: [Company] })
    @UseGuards(AdminAuthGuard)
    @Get()
    getAll() {
        return this.companyService.getAll();
    }

    @ApiOkResponse({ type: Company })
    @UseGuards(AdminAuthGuard)
    @DocumentMetadata(DocumentMetadataType.CREATED_AT, DocumentMetadataType.CREATED_BY)
    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @ApiOkResponse({ type: Company })
    @UseGuards(UserAuthGuard)
    @Get(':companyId')
    async getById(@Param('companyId', new ParseIdPipe()) companyId: string) {
        const company = await this.companyService.getById(companyId);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }

    @ApiOkResponse({ type: Company })
    @UseGuards(AdminAuthGuard)
    @DocumentMetadata(DocumentMetadataType.EDITED_AT, DocumentMetadataType.EDITED_BY)
    @Put(':companyId')
    async edit(@Param('companyId', new ParseIdPipe()) companyId: string, @Body() editCompanyDto: EditCompanyDto) {
        const company = await this.companyService.edit(companyId, editCompanyDto);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }

    @ApiOkResponse()
    @UseGuards(AdminAuthGuard)
    @DocumentMetadata(DocumentMetadataType.DELETED_AT, DocumentMetadataType.DELETED_BY)
    @Delete(':companyId')
    async delete(@Param('companyId', new ParseIdPipe()) companyId: string) {
        // TODO hard delete
        const company = await this.companyService.getById(companyId);
        if (company == null) throw new NotFoundException('Company not found!');
        return company;
    }
}
