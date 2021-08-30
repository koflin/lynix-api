import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateProcessDto } from 'src/dto/process/createProcessDto';
import { Process } from 'src/models/process.model';
import { User } from 'src/models/user.model';
import { ProcessDoc } from 'src/schemas/process.schema';

import { EventGateway } from '../event/event.gateway';
import { Event } from '../event/event.model';
import { OrdersService } from '../orders/orders.service';
import { ProcessTemplatesService } from '../templates/process-templates/process-templates.service';
import { UsersService } from '../users/users.service';
import { EditProcessDto } from './../../dto/process/editProcessDto';

@Injectable()
export class ProcessesService {
    constructor(
        @InjectModel(ProcessDoc.name) private processModel: Model<ProcessDoc>,
        private processTemplatesService: ProcessTemplatesService,
        private orderService: OrdersService,
        private usersService: UsersService,
        private events: EventGateway
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

        processDoc.status = 'in_progress';
        processDoc.occupiedBy = user.id;
        processDoc.isRunning = false;
        await processDoc.save();
        return this.getById(processDoc.id);
    }

    async exit(id: string) {
        const processDoc = await this.processModel.findById(id).exec();

        processDoc.occupiedBy = null;
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

        processDoc.status = 'completed';
        processDoc.occupiedBy = null;
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

    async getAll(companyId?: string, assignedUserId?: string, orderId?: string): Promise<Process[]> {
        const processIds = await this.processModel.find({ companyId, assignedUserId, orderId, }, '_id').exec();
        return Promise.all(processIds.map( async (doc) => {
            return this.getById(doc._id);
        }));
    }

    async getById(id: string): Promise<Process> {
        const processDoc = await this.processModel.findById(id).exec();
        const order = await this.orderService.getById(processDoc.orderId);
        
        if (processDoc) {
            return new Process(processDoc, order);
        }

        return null;
    }

    async create(processDto: CreateProcessDto, user: User): Promise<Process> {
        const processDoc = new this.processModel(processDto);
        const templateDoc = await this.processTemplatesService.getById(processDoc.templateId);
        const order = await this.orderService.getById(processDoc.orderId);

        if (templateDoc == null) {
            return null;
        }

        processDoc.companyId = user.companyId;

        processDoc.status = 'released';
        processDoc.estimatedTime = templateDoc.steps.reduce((total, step) => total + (step.estimatedTime ? step.estimatedTime : 0), 0);
        processDoc.deliveryDate = order.deliveryDate;
        processDoc.mainTasks = templateDoc.mainTasks;
        processDoc.name = templateDoc.name;
        processDoc.previousComments = templateDoc.previousComments;
        processDoc.steps = templateDoc.steps.map((stepTemplate) => {
            return {
                ...stepTemplate,
                timeTaken: 0
            };
        });


        processDoc.timeTaken = 0;
        processDoc.currentStepIndex = null;
        processDoc.assignedUserId = null;
        processDoc.occupiedBy = null;
        processDoc.isRunning = false;

        await processDoc.save();
        return this.getById(processDoc.id);
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

    async updateOccupied(): Promise<void> {
        await this.processModel.find({ occupiedBy: { $ne: null }}, (err, doc) => {
            doc.forEach(async (doc) => {
                this.usersService.getActivity(doc.occupiedBy).then((activity) => {

                    if (activity.status == 'online' && activity.activity == 'guide') {
                        // Running
                        if (doc.isRunning && doc.currentStepIndex != null) {
                            doc.timeTaken += 1;
                            doc.steps[doc.currentStepIndex].timeTaken += 1;
                            this.events.trigger(Event.PROCESS_GUIDE_TICK, doc.occupiedBy, { processId: doc.id, timeTaken: doc.timeTaken, stepIndex: doc.currentStepIndex, stepTime: doc.steps[doc.currentStepIndex].timeTaken });
                        }
                    } else {
                        // Force terminate
                        doc.isRunning = false;
                        doc.occupiedBy = null;

                        this.events.trigger(Event.PROCESS_GUIDE_EXIT, doc.occupiedBy);
                    }

                    doc.save();
                });
            });
        });
        return;
    }
}
