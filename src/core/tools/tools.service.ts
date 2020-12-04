import { Tool } from './../../models/tool.model';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToolDoc } from 'src/schemas/tool.schema';

@Injectable()
export class ToolsService {
    constructor(@InjectModel(ToolDoc.name) private toolModel: Model<ToolDoc>, private http: HttpService) {
    }

    async getAll(): Promise<Tool[]> {
        let toolDoc = await this.toolModel.find().exec();
        return toolDoc.map(doc => new Tool(doc));
    }

    async getById(id: string): Promise<Tool> {
        let toolDoc = await this.toolModel.findById(id).exec();
        return toolDoc == null ? null : new Tool(toolDoc);
    }

    async create(dto: any): Promise<Tool> {
        let toolDoc = new this.toolModel(dto);
        return new Tool(await toolDoc.save());
    }

    async edit(id: string, dto: any): Promise<Tool> {
        let toolDoc = await this.toolModel.findByIdAndUpdate(id, {
            ...dto,
        }, { new: true, omitUndefined: true }).exec();
        return toolDoc == null ? null : new Tool(toolDoc);
    }

    async delete(id: string): Promise<void> {
        await this.toolModel.findByIdAndDelete(id).exec();
        return;
    }
}
