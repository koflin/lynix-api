import { ProductTemplate } from './../../../models/productTemplate.model';
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductTemplateDoc } from 'src/schemas/productTemplate.schema';
import { ProductTemplatesService } from './product-templates.service';
import { EditProductTemplateDto } from 'src/dto/productTemplate/editProductTemplateDto';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { User } from 'src/models/user.model';
import { ParseIdPipe } from 'src/pipes/parse-id.pipe';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { CompaniesGuard } from 'src/core/companies/companies.guard';
import { PermissionsGuard } from 'src/core/auth/permissions.guard';
import { Permissions } from 'src/core/auth/permissions.decorator';
import { Permission } from 'src/models/role.model';

@ApiTags('product-templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CompaniesGuard, PermissionsGuard)
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
    create(@Request() req: { user: User }, @Body() editProductDto: EditProductTemplateDto) {
        return this.productService.create(editProductDto, req.user);
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
