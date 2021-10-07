import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Account } from 'src/core/auth/account.decorator';
import { PermissionsGuard } from 'src/core/auth/permissions.guard';
import { RequiredPermissions } from 'src/core/auth/required-permissions.decorator';
import { UserAuthGuard } from 'src/core/auth/user-auth.guard';
import { EditProductTemplateDto } from 'src/dto/productTemplate/editProductTemplateDto';
import { ApplyDocumentMetadata } from 'src/interceptors/document-metadata/apply-document-metadata.decorator';
import { DocumentMetadataType } from 'src/interceptors/document-metadata/document-metadata';
import { DocumentMetadata } from 'src/interceptors/document-metadata/document-metadata.decorator';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { ProductTemplate } from './../../../models/productTemplate.model';
import { ProductTemplatesService } from './product-templates.service';

@ApiTags('product-templates')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@ApplyDocumentMetadata(ProductTemplatesService)
@Controller('templates/product')
export class ProductTemplatesController {
    constructor(private productService: ProductTemplatesService) {
    }

    @ApiOkResponse({ type: [ProductTemplate] })
    @ApiQuery({ name: 'companyId', required: false })
    @RequiredPermissions(Permission.TEMPLATE_VIEW)
    @Get()
    getAll(@Account() user: User) {
        return this.productService.getAll({ companyId: user.companyId });
    }

    @ApiOkResponse({ type: ProductTemplate })
    @RequiredPermissions(Permission.TEMPLATE_EDIT)
    @DocumentMetadata(DocumentMetadataType.CREATED_AT, DocumentMetadataType.CREATED_BY)
    @Post()
    create(@Account() user: User, @Body() editProductDto: EditProductTemplateDto) {
        return this.productService.create(editProductDto, user);
    }

    @ApiOkResponse({ type: ProductTemplate })
    @RequiredPermissions(Permission.TEMPLATE_VIEW)
    @Get(':templateId')
    async getById(@Param('templateId', new ParseIdPipe()) templateId: string) {
        const productTemplate = await this.productService.getById(templateId);
        if (productTemplate == null) throw new NotFoundException('Product template not found!');
        return productTemplate;
    }

    @ApiOkResponse({ type: ProductTemplate })
    @RequiredPermissions(Permission.TEMPLATE_EDIT)
    @DocumentMetadata(DocumentMetadataType.EDITED_AT, DocumentMetadataType.EDITED_BY)
    @Put(':templateId')
    async edit(@Param('templateId', new ParseIdPipe()) templateId: string, @Body() editProductDto: EditProductTemplateDto) {
        const productTemplate = await this.productService.edit(templateId, editProductDto);
        if (productTemplate == null) throw new NotFoundException('Product template not found!');
        return productTemplate;
    }

    @ApiOkResponse()
    @RequiredPermissions(Permission.TEMPLATE_EDIT)
    @DocumentMetadata(DocumentMetadataType.DELETED_AT, DocumentMetadataType.DELETED_BY)
    @Delete(':templateId')
    async delete(@Param('templateId', new ParseIdPipe()) templateId: string) {
        // TODO hard delete const productTemplate = await this.productService.delete(templateId);
        const productTemplate = await this.productService.getById(templateId);
        if (productTemplate == null) throw new NotFoundException('Product template not found!');
        return productTemplate;
    }
}
