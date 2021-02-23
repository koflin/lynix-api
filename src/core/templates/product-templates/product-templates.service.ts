import { ProcessTemplatesService } from './../process-templates/process-templates.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/user/createUserDto';
import { EditUserDto } from 'src/dto/user/editUserDto';
import { ProductTemplate } from 'src/models/productTemplate.model';
import { User } from 'src/models/user.model';
import { ProductTemplateDoc } from 'src/schemas/productTemplate.schema';
import { UserDoc } from 'src/schemas/user.schema';
import { EditProductTemplateDto } from 'src/dto/productTemplate/editProductTemplateDto';

@Injectable()
export class ProductTemplatesService {
    constructor(
        @InjectModel(ProductTemplateDoc.name) private productModel: Model<ProductTemplateDoc>,
        private processTemplatesService: ProcessTemplatesService
        ) {
    }

    async getAll(filter: { companyId?: string }): Promise<ProductTemplate[]> {
        let productIds = await this.productModel.find(filter, '_id').exec();
        return Promise.all(productIds.map( async (doc) => {
            return this.getById(doc._id);
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
        return this.getById(productDoc._id);
    }

    async edit(id: string, productDto: EditProductTemplateDto): Promise<ProductTemplate> {
        let productDoc = await this.productModel.findByIdAndUpdate(id, {
            ...productDto,
        }, { new: true, omitUndefined: true });

        await productDoc.save();
        return this.getById(productDoc._id);
    }

    async delete(id: string): Promise<void> {
        await this.productModel.findByIdAndDelete(id).exec();
        return;
    }
}
