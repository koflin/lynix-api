import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EditProductTemplateDto } from 'src/dto/productTemplate/editProductTemplateDto';
import { ProductTemplate } from 'src/models/productTemplate.model';
import { User } from 'src/models/user.model';
import { ProductTemplateDoc } from 'src/schemas/productTemplate.schema';

import { ProcessTemplatesService } from './../process-templates/process-templates.service';

@Injectable()
export class ProductTemplatesService {
    constructor(
        @InjectModel(ProductTemplateDoc.name) private productModel: Model<ProductTemplateDoc>,
        private processTemplatesService: ProcessTemplatesService
        ) {
    }

    async getAll(filter: { companyId?: string }): Promise<ProductTemplate[]> {
        let productIds = await this.productModel.find({ ...filter, deletedAt: null}, '_id').exec();
        return Promise.all(productIds.map( async (doc) => {
            return this.getById(doc.id);
        }));
    }

    async getById(id: string): Promise<ProductTemplate> {
        let productDoc = await this.productModel.findById(id).exec();

        if (productDoc) {
            let processDocs = await Promise.all(productDoc.processes.map((process) => {
                return this.processTemplatesService.getById(process.templateId);
            }));
            return new ProductTemplate(productDoc, processDocs);
        }

        return null;
    }

    async create(productDto: EditProductTemplateDto, user: User): Promise<ProductTemplate> {
        let productDoc = new this.productModel(productDto);
        productDoc.companyId = user.companyId;
        await productDoc.save();
        return this.getById(productDoc.id);
    }

    async edit(id: string, productDto: EditProductTemplateDto): Promise<ProductTemplate> {
        let productDoc = await this.productModel.findByIdAndUpdate(id, {
            ...productDto,
        }, { new: true, omitUndefined: true });

        await productDoc.save();
        return this.getById(productDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.productModel.findByIdAndUpdate(id, { $currentDate: { deletedAt: true } }).exec();
        return;
    }
}
