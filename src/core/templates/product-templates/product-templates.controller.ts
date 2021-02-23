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

@ApiTags('product-templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('templates/product')
export class ProductTemplatesController {
    constructor(private productService: ProductTemplatesService) {
    }

    @ApiOkResponse({ type: [ProductTemplate] })
    @ApiQuery({ name: 'companyId', required: false })
    @Get()
    getAll(@Query() filter: { companyId: string }) {
        return this.productService.getAll(filter);
    }

    @ApiOkResponse({ type: ProductTemplate })
    @Post()
    create(@Request() req: { user: User }, @Body() editProductDto: EditProductTemplateDto) {
        return this.productService.create(editProductDto, req.user);
    }

    @ApiOkResponse({ type: ProductTemplate })
    @Get(':templateId')
    getById(@Param('templateId', new ParseIdPipe()) templateId: string) {
        let productTemplate = this.productService.getById(templateId);
        if (productTemplate == null) throw new NotFoundException('Product template not found!');
        return productTemplate;
    }

    @ApiOkResponse({ type: ProductTemplate })
    @Put(':templateId')
    edit(@Param('templateId', new ParseIdPipe()) templateId: string, @Body() editProductDto: EditProductTemplateDto) {
        let productTemplate = this.productService.edit(templateId, editProductDto);
        if (productTemplate == null) throw new NotFoundException('Product template not found!');
        return productTemplate;
    }

    @ApiOkResponse()
    @Delete(':templateId')
    delete(@Param('templateId', new ParseIdPipe()) templateId: string) {
        let productTemplate = this.productService.delete(templateId);
        if (productTemplate == null) throw new NotFoundException('Product template not found!');
        return productTemplate;
    }
}
