import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetadataService } from 'src/core/metadata/metadata.service';
import { ProcessTemplate } from 'src/models/processTemplate';
import { ProcessTemplateDoc } from 'src/schemas/processTemplate.schema';

import { EditProcessTemplateDto } from './../../../dto/processTemplate/editProcessTemplateDto';
import { User } from './../../../models/user.model';

@Injectable()
export class ProcessTemplatesService {
    constructor(
        @InjectModel(ProcessTemplateDoc.name) private processTemplateModel: Model<ProcessTemplateDoc>,
        private metadataSerivce: MetadataService
        ) {
    }

    async getAll(filter: { companyId?: string }): Promise<ProcessTemplate[]> {
        const processIds = await this.processTemplateModel.find({ ...filter, deletedAt: null }, '_id').exec();
        return Promise.all(processIds.map( async (doc) => {
            return this.getById(doc.id);
        }));
    }

    async getById(id: string): Promise<ProcessTemplate> {
        const processDoc = await this.processTemplateModel.findById(id).exec();
        return processDoc == null ? null : new ProcessTemplate(await this.metadataSerivce.get(processDoc), processDoc);
    }

    async create(processDto: EditProcessTemplateDto, user: User): Promise<ProcessTemplate> {
        const processDoc = new this.processTemplateModel(processDto);
        processDoc.companyId = user.companyId;
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async edit(id: string, processDto: EditProcessTemplateDto): Promise<ProcessTemplate> {
        const processDoc = await this.processTemplateModel.findByIdAndUpdate(id, {
            ...processDto
        }, { new: true, omitUndefined: true }).exec();
        
        return processDoc == null ? null : this.getById(processDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.processTemplateModel.findByIdAndUpdate(id, { $currentDate: { deletedAt: true } }).exec();
        return;
    }
}
