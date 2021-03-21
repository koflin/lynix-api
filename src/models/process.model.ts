import { ApiProperty } from '@nestjs/swagger';
import { ProcessDoc } from 'src/schemas/process.schema';

import { Order } from './order.model';
import { Step } from './step.model';

export class Process {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;

    @ApiProperty()
    order: Order;
    @ApiProperty()
    templateId: string;

    @ApiProperty()
    name: string;
    @ApiProperty()
    mainTasks: string[];
    @ApiProperty()
    previousComments: string[];
    @ApiProperty()
    estimatedTime: number;
    @ApiProperty()
    deliveryDate: Date;

    @ApiProperty()
    timeTaken: number;
    @ApiProperty()
    currentStepIndex: number;
    @ApiProperty()
    status: 'in_preparation' | 'released' | 'in_progress' | 'completed' | 'assistance_required';
    @ApiProperty()
    occupiedBy: string;
    @ApiProperty()
    isRunning: boolean;

    @ApiProperty()
    assignedUserId: string;

    @ApiProperty()
    steps: Step[];

    constructor(process: ProcessDoc, order: Order) {
        this.id = process.id;
        this.companyId = process.companyId;
        this.order = order;
        this.templateId = process.templateId;

        this.name = process.name;
        this.mainTasks = process.mainTasks;
        this.previousComments = process.previousComments;
        this.estimatedTime = process.estimatedTime;
        this.deliveryDate = process.deliveryDate;

        this.timeTaken = process.timeTaken;
        this.currentStepIndex = process.currentStepIndex;
        this.status = process.status;
        this.occupiedBy = process.occupiedBy;
        this.isRunning = process.isRunning;

        this.assignedUserId = process.assignedUserId;

        this.steps = process.steps.map(step => new Step(step));
    }
}