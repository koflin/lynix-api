import { EditProcessDto } from './../../dto/process/editProcessDto';
import { ProductTemplateDoc } from 'src/schemas/productTemplate.schema';
import { OrderDoc } from './../../schemas/order.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProcessDto } from 'src/dto/process/createProcessDto';
import { Process } from 'src/models/process.model';
import { ProcessDoc } from 'src/schemas/process.schema';
import { ProcessTemplatesService } from '../templates/process-templates/process-templates.service';
import { User } from 'src/models/user.model';

@Injectable()
export class ProcessesService {
    constructor(
        @InjectModel(ProcessDoc.name) private processModel: Model<ProcessDoc>,
        private processTemplatesService: ProcessTemplatesService
    ) { }

    async start(id: string, userId: string) {
        let processDoc = await this.processModel.findById(id).exec();

        processDoc.status = 'in_progress';
        processDoc.isOccupied = true;
        processDoc.isRunning = true;
        processDoc.save();
        return;
    }

    async stop(id: string) {
        let processDoc = await this.processModel.findById(id).exec();

        processDoc.isOccupied = false;
        processDoc.isRunning = false;
        processDoc.save();
        return;
    }

    async assign(id: string, assignedId: string) {
        let processDoc = await this.processModel.findById(id).exec();

        processDoc.assignedUserId = assignedId;
        processDoc.save();
        return;
    }

    async finish(id: string, assignedId: string) {
        let processDoc = await this.processModel.findById(id).exec();

        processDoc.status = 'completed';
        processDoc.isOccupied = false;
        processDoc.isRunning = false;
        processDoc.save();
        return;
    }

    async getAll(filter: { companyId?: string, assignedUserId?: string, orderId?: string }): Promise<Process[]> {
        let processIds = await this.processModel.find(filter, '_id').exec();
        return Promise.all(processIds.map( async (doc) => {
            return this.getById(doc._id);
        }));
    }

    async getById(id: string): Promise<Process> {
        let processDoc = await this.processModel.findById(id).exec();
        
        if (processDoc) {
            return new Process(processDoc);
        }

        return null;
    }

    async create(processDto: CreateProcessDto, user: User): Promise<Process> {
        let processDoc = new this.processModel(processDto);
        let templateDoc = await this.processTemplatesService.getById(processDoc.templateId);

        if (templateDoc == null) {
            return null;
        }

        processDoc.companyId = user.companyId;

        processDoc.status = 'released';
        processDoc.estimatedTime = templateDoc.stepTemplates.reduce((total, step) => total + (step.estimatedTime ? step.estimatedTime : 0), 0);
        processDoc.mainTasks = templateDoc.mainTasks;
        processDoc.name = templateDoc.name;
        processDoc.previousComments = templateDoc.previousComments;
        processDoc.steps = templateDoc.stepTemplates.map((stepTemplate) => {
            return {
                ...stepTemplate,
                timeTaken: 0
            };
        });

        processDoc.timeTaken = 0;
        processDoc.currentStepIndex = null;
        processDoc.assignedUserId = null;
        processDoc.isOccupied = false;
        processDoc.isRunning = false;

        return new Process(await processDoc.save());
    }

    async edit(id: string, processDto: EditProcessDto): Promise<Process> {
        await this.processModel.findByIdAndUpdate(id, {
            ...processDto
        } as any, { new: true, omitUndefined: true });

        return this.getById(id);
    }

    async delete(id: string): Promise<void> {
        await this.processModel.findByIdAndDelete(id).exec();
        return;
    }

    async exists(id: string): Promise<boolean> {
        return this.processModel.exists({ _id: id });
    }

    async updateRunning(): Promise<void> {
        await this.processModel.find({ isRunning: true }, (err, doc) => {
            doc.forEach((doc) => {
                doc.timeTaken += 1;
                doc.save();
            });
        });
        return;
    }
}
