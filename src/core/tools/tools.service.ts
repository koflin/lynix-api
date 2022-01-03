import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToolDoc } from 'src/schemas/tool.schema';

import { MetadataService } from '../metadata/metadata.service';
import { Tool } from './../../models/tool.model';

@Injectable()
export class ToolsService {
    constructor(
        @InjectModel(ToolDoc.name) private toolModel: Model<ToolDoc>, private http: HttpService,
        private metadataSerivce: MetadataService
    ) {
    }

    async getAll(companyId: string): Promise<Tool[]> {
        const toolIds = await this.toolModel.find({
            companyId,
        }, '_id').exec();
        return Promise.all(toolIds.map( async (doc) => {
            return this.getById(doc.id);
        }));
    }

    async getById(id: string): Promise<Tool> {
        const toolDoc = await this.toolModel.findById(id).exec();
        return toolDoc == null ? null : new Tool(await this.metadataSerivce.get(toolDoc), toolDoc);
    }

    async create(dto: any): Promise<Tool> {
        const toolDoc = new this.toolModel(dto);
        await toolDoc.save();
        return this.getById(toolDoc.id);
    }

    async edit(id: string, dto: any): Promise<Tool> {
        const toolDoc = await this.toolModel.findByIdAndUpdate(id, {
            ...dto,
        }, { new: true, omitUndefined: true }).exec();
        return toolDoc == null ? null : this.getById(toolDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.toolModel.findByIdAndDelete(id).exec();
        return;
    }
}
