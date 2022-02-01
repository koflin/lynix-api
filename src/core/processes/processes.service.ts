import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateProcessDto } from 'src/dto/process/createProcess.dto';
import { ProcessStatus } from 'src/models/enums/processStatus.enum';
import { Process } from 'src/models/process.model';
import { User } from 'src/models/user.model';
import { ProcessDoc } from 'src/schemas/process.schema';
import { ProcessTemplateDoc } from 'src/schemas/processTemplate.schema';
import { StepDoc } from 'src/schemas/step.schema';

import { EditProcessDto } from '../../dto/process/editProcess.dto';
import { EventGateway } from '../event/event.gateway';
import { Event } from '../event/event.model';
import { MetadataService } from '../metadata/metadata.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { GetProcessesDto } from './../../dto/process/getProcesses.dto';

@Injectable()
export class ProcessesService {
    constructor(
        @InjectModel(ProcessDoc.name) private processModel: Model<ProcessDoc>,
        @InjectModel(ProcessTemplateDoc.name) private processTemplateModel: Model<ProcessTemplateDoc>,
        @InjectModel(StepDoc.name) private stepModel: Model<StepDoc>,
        private orderService: OrdersService,
        private usersService: UsersService,
        private events: EventGateway,
        private metadataSerivce: MetadataService
    ) {
    }

    async start(id: string, userId: string) {
        const processDoc = await this.processModel.findById(id).exec();

        processDoc.isRunning = true;
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async stop(id: string) {
        const processDoc = await this.processModel.findById(id).exec();

        processDoc.isRunning = false;
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async enter(id: string, user: User) {
        const processDoc = await this.processModel.findById(id).exec();

        processDoc.status = ProcessStatus.IN_PROGRESS;
        processDoc.occupiedById = user.id;
        processDoc.isRunning = false;
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async exit(id: string) {
        const processDoc = await this.processModel.findById(id).exec();

        processDoc.occupiedById = null;
        processDoc.isRunning = false;
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async assign(id: string, assignedId: string) {
        const processDoc = await this.processModel.findById(id).exec();

        processDoc.assignedUserId = assignedId;
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async finish(id: string, assignedId: string) {
        const processDoc = await this.processModel.findById(id).exec();

        processDoc.status = ProcessStatus.COMPLETED;
        processDoc.occupiedById = null;
        processDoc.isRunning = false;
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async switch(id: string, stepIndex: number) {
        const processDoc = await this.processModel.findById(id).exec();

        processDoc.currentStepIndex = stepIndex;
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async getAll(options: GetProcessesDto, companyId?: string): Promise<Process[]> {
        const { assignedUserId, orderId, offset, limit, status } = options;

        const processIds = await this.processModel.find({ companyId, assignedUserId, orderId, status, deletedAt: { $exists: false } }, '_id').skip(offset).limit(limit).exec();
        return Promise.all(processIds.map( async (doc) => {
            return this.getById(doc._id);
        }));
    }

    async getById(id: string): Promise<Process> {
        const processDoc = await this.processModel.findById(id).exec();
        const order = await this.orderService.getById(processDoc.orderId);
        
        if (processDoc) {
            return new Process(await this.metadataSerivce.get(processDoc), processDoc, order);
        }

        return null;
    }

    async create(processDto: CreateProcessDto, user: User): Promise<Process> {
        const processDoc = new this.processModel(processDto);
        const templateDoc = await this.processTemplateModel.findById(processDto.templateId);
        const order = await this.orderService.getById(processDoc.orderId);

        if (templateDoc == null) {
            return null;
        }

        processDoc.companyId = user.companyId;

        processDoc.status = ProcessStatus.RELEASED;
        processDoc.estimatedTime = templateDoc.steps.reduce((total, step) => total + (step.estimatedTime ? step.estimatedTime : 0), 0);
        processDoc.deliveryDate = order.deliveryDate;
        processDoc.mainTasks = templateDoc.mainTasks;
        processDoc.name = templateDoc.name;
        processDoc.previousComments = templateDoc.previousComments;

        processDoc.steps = templateDoc.steps.map((stepTemplate) => {
            return new this.stepModel({ ...stepTemplate.toObject(), timeTaken: 0 });
        });

        processDoc.timeTaken = 0;
        processDoc.currentStepIndex = null;
        processDoc.assignedUserId = null;
        processDoc.occupiedById = null;
        processDoc.isRunning = false;

        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async edit(id: string, processDto: EditProcessDto): Promise<Process> {
        await this.processModel.findByIdAndUpdate(id, {
            ...processDto
        } as any, { new: true, omitUndefined: true }).exec();

        return this.getById(id);
    }

    async delete(id: string): Promise<void> {
        await this.processModel.findByIdAndDelete(id).exec();
        return;
    }

    async exists(id: string): Promise<boolean> {
        return this.processModel.exists({ _id: id });
    }

    async updateOccupied(): Promise<void> {
        const processes = await this.processModel.find({ occupiedById: { $ne: null }});
        
        for (let doc of processes) {

            this.usersService.getActivity(doc.occupiedById).then((activity) => {

                if (activity.status == 'online' && activity.activity == 'guide') {
                    // Running
                    if (doc.isRunning && doc.currentStepIndex != null) {
                        doc.timeTaken += 1;
                        doc.steps[doc.currentStepIndex].timeTaken += 1;
                        this.events.trigger(Event.PROCESS_GUIDE_TICK, doc.occupiedById, { processId: doc.id, timeTaken: doc.timeTaken, stepIndex: doc.currentStepIndex, stepTime: doc.steps[doc.currentStepIndex].timeTaken });
                    }
                } else {
                    // Force terminate
                    doc.isRunning = false;
                    doc.occupiedById = null;

                    this.events.trigger(Event.PROCESS_GUIDE_EXIT, doc.occupiedById);
                }

                doc.save();
            });
        }

        return;
    }
}
