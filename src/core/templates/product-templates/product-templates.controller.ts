import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Account } from 'src/core/auth/account.decorator';
import { Permissions } from 'src/core/auth/permissions.decorator';
import { PermissionsGuard } from 'src/core/auth/permissions.guard';
import { UserAuthGuard } from 'src/core/auth/user-auth.guard';
import { EditProductTemplateDto } from 'src/dto/productTemplate/editProductTemplateDto';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';

import { ProductTemplate } from './../../../models/productTemplate.model';
import { ProductTemplatesService } from './product-templates.service';

@ApiTags('product-templates')
@ApiBearerAuth()
@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('templates/product')
export class ProductTemplatesController {
    constructor(private productService: ProductTemplatesService) {
    }

    @ApiOkResponse({ type: [ProductTemplate] })
    @ApiQuery({ name: 'companyId', required: false })
    @Permissions(Permission.VIEW)
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.productService.getAll(filter);
    }

    @ApiOkResponse({ type: ProductTemplate })
    @Permissions(Permission.EDIT)
    @Post()
    create(@Account() user: User, @Body() editProductDto: EditProductTemplateDto) {
        return this.productService.create(editProductDto, user);
    }

    @ApiOkResponse({ type: ProductTemplate })
    @Permissions(Permission.VIEW)
    @Get(':templateId')
    getById(@Param('templateId', new ParseIdPipe()) templateId: string) {
        let productTemplate = this.productService.getById(templateId);
        if (productTemplate == null) throw new NotFoundException('Product template not found!');
        return productTemplate;
    }

    @ApiOkResponse({ type: ProductTemplate })
    @Permissions(Permission.EDIT)
    @Put(':templateId')
    edit(@Param('templateId', new ParseIdPipe()) templateId: string, @Body() editProductDto: EditProductTemplateDto) {
        let productTemplate = this.productService.edit(templateId, editProductDto);
        if (productTemplate == null) throw new NotFoundException('Product template not found!');
        return productTemplate;
    }

    @ApiOkResponse()
    @Permissions(Permission.EDIT)
    @Delete(':templateId')
    delete(@Param('templateId', new ParseIdPipe()) templateId: string) {
        let productTemplate = this.productService.delete(templateId);
        if (productTemplate == null) throw new NotFoundException('Product template not found!');
        return productTemplate;
    }
}
