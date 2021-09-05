import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetadataService } from 'src/core/metadata/metadata.service';
import { EditProductTemplateDto } from 'src/dto/productTemplate/editProductTemplateDto';
import { ProductTemplate } from 'src/models/productTemplate.model';
import { User } from 'src/models/user.model';
import { ProductTemplateDoc } from 'src/schemas/productTemplate.schema';

import { ProcessTemplatesService } from './../process-templates/process-templates.service';

@Injectable()
export class ProductTemplatesService {
    constructor(
        @InjectModel(ProductTemplateDoc.name) private productModel: Model<ProductTemplateDoc>,
        private processTemplatesService: ProcessTemplatesService,
        private metadataSerivce: MetadataService
        ) {
    }

    async getAll(filter: { companyId?: string }): Promise<ProductTemplate[]> {
        const productIds = await this.productModel.find({ ...filter, deletedAt: null}, '_id').exec();
        return Promise.all(productIds.map( async (doc) => {
            return this.getById(doc.id);
        }));
    }

    async getById(id: string): Promise<ProductTemplate> {
        const productDoc = await this.productModel.findById(id).exec();

        if (productDoc) {
            const processDocs = await Promise.all(productDoc.processes.map((process) => {
                return this.processTemplatesService.getById(process.templateId);
            }));
            return new ProductTemplate(await this.metadataSerivce.get(productDoc), productDoc, processDocs);
        }

        return null;
    }

    async create(productDto: EditProductTemplateDto, user: User): Promise<ProductTemplate> {
        const productDoc = new this.productModel(productDto);
        productDoc.companyId = user.companyId;
        await productDoc.save();
        return this.getById(productDoc.id);
    }

    async edit(id: string, productDto: EditProductTemplateDto): Promise<ProductTemplate> {
        const productDoc = await this.productModel.findByIdAndUpdate(id, {
            ...productDto,
        }, { new: true, omitUndefined: true }).exec();

        return this.getById(productDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.productModel.findByIdAndUpdate(id, { $currentDate: { deletedAt: true } }).exec();
        return;
    }
}
