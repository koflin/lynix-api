import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EditProcessDto } from 'src/dto/process/editProcessDto';
import { Process } from 'src/models/process.model';
import { ProcessDoc } from 'src/schemas/process.schema';
import { ProcessTemplatesService } from '../templates/process-templates/process-templates.service';

@Injectable()
export class ProcessesService {
    constructor(
        @InjectModel(ProcessDoc.name) private processModle: Model<ProcessDoc>,
        private processTemplatesService: ProcessTemplatesService
    ) { }

    async getAll(filter: { companyId?: string }): Promise<Process[]> {
        let processIds = await this.processModle.find(filter, '_id').exec();
        return Promise.all(processIds.map( async (doc) => {
            return this.getById(doc._id);
        }));
    }

    async getById(id: string): Promise<Process> {
        let processDoc = await this.processModle.findById(id).exec();
        
        if (processDoc) {
            return new Process(processDoc);
        }

        return null;
    }

    async create(processDto: EditProcessDto): Promise<Process> {
        let processDoc = new this.processModle(processDto);
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async edit(id: string, processDto: EditProcessDto): Promise<Process> {
        let processDoc = await this.processModle.findByIdAndUpdate(id, {
            ...processDto
        } as any, { new: true, omitUndefined: true });

        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async delete(id: string): Promise<void> {
        await this.processModle.findByIdAndDelete(id).exec();
        return;
    }
}
