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
        @InjectModel(ProcessDoc.name) private orderModel: Model<ProcessDoc>
        @InjectModel(ProcessDoc.name) private productTemplateModel: Model<ProcessDoc>
        private processTemplatesService: ProcessTemplatesService
    ) { }

    async start(id: string, userId: string) {
        let processDoc = await this.processModle.findById(id).exec();

        processDoc.status = 'in_progress';
        processDoc.isOccupied = true;
        processDoc.save();
        return;
    }

    async stop(id: string) {
        let processDoc = await this.processModle.findById(id).exec();

        processDoc.isOccupied = false;
        processDoc.save();
        return;
    }

    async assign(id: string, assignedId: string) {
        let processDoc = await this.processModle.findById(id).exec();

        processDoc.assignedUserId = assignedId;
        processDoc.save();
        return;
    }

    async finish(id: string, assignedId: string) {
        let processDoc = await this.processModle.findById(id).exec();

        processDoc.status = 'completed';
        processDoc.save();
        return;
    }

    async getAll(filter: { companyId?: string, assignedUserId?: string, orderId?: string }): Promise<Process[]> {
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

    async createForOrder(orderId: string): Promise<Process> {
        let orderDoc = await this.
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
