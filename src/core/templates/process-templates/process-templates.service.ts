import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProcessTemplate } from 'src/models/processTemplate';
import { ProcessTemplateDoc } from 'src/schemas/processTemplate.schema';

import { EditProcessTemplateDto } from './../../../dto/processTemplate/editProcessTemplateDto';
import { User } from './../../../models/user.model';

@Injectable()
export class ProcessTemplatesService {
    constructor(
        @InjectModel(ProcessTemplateDoc.name) private processTemplateModel: Model<ProcessTemplateDoc>
        ) {
    }

    async getAll(filter: { companyId?: string }): Promise<ProcessTemplate[]> {
        let processDocs = await this.processTemplateModel.find({ ...filter, deletedAt: null }).exec();
        return processDocs.map(doc => new ProcessTemplate(doc));
    }

    async getById(id: string): Promise<ProcessTemplate> {
        let processDoc = await this.processTemplateModel.findById(id).exec();
        return processDoc == null ? null : new ProcessTemplate(processDoc);
    }

    async create(processDto: EditProcessTemplateDto, user: User): Promise<ProcessTemplate> {
        let processDoc = new this.processTemplateModel(processDto);
        processDoc.companyId = user.companyId;
        await processDoc.save();
        return this.getById(processDoc._id);
    }

    async edit(id: string, processDto: EditProcessTemplateDto): Promise<ProcessTemplate> {
        let processDoc = await this.processTemplateModel.findByIdAndUpdate(id, {
            ...processDto
        }, { new: true, omitUndefined: true });
        
        return processDoc == null ? null : new ProcessTemplate(await processDoc.save());
    }

    async delete(id: string): Promise<void> {
        await this.processTemplateModel.findByIdAndUpdate(id, { $currentDate: { deletedAt: true } }).exec();
        return;
    }
}
