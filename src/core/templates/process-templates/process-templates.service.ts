import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { filter } from 'rxjs/operators';
import { MetadataService } from 'src/core/metadata/metadata.service';
import { ProcessTemplatePreview } from 'src/models/previews/processTemplate-preview.model';
import { ProcessTemplate } from 'src/models/processTemplate';
import { ProcessTemplateDoc } from 'src/schemas/processTemplate.schema';

import { EditProcessTemplateDto } from '../../../dto/processTemplate/editProcessTemplate.dto';
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

    async search(filter: { companyId?: string, name?: string, limit?: number}) {
        const { companyId, limit, name } = filter;
        const filterAddition: FilterQuery<ProcessTemplateDoc> = {};

        if (name)  filterAddition.name = { $regex: name };

        let query = this.processTemplateModel.find({ 
            companyId,
        } && filterAddition, '_id companyId name');

        if (limit) query = query.limit(limit);

        const processDocs = await query.exec();
        if (!processDocs) return undefined;

        return processDocs.map(doc => new ProcessTemplatePreview(doc));
    }
}
