import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ProcessDoc } from 'src/schemas/process.schema';

import { Metadata } from './base/metadata.interface';
import { MetadataEntity } from './base/metadata.model';
import { ProcessStatus } from './enums/processStatus.enum';
import { Order } from './order.model';
import { Step } from './step.model';

@ObjectType()
export class Process extends MetadataEntity {
    @ApiProperty()
    @Field(type => ID)
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
    releasedAt: Date;
    @ApiProperty()
    startedAt: Date;
    @ApiProperty()
    completedAt: Date;

    @ApiProperty()
    timeTaken: number;
    @ApiProperty()
    currentStepIndex: number;
    @ApiProperty()
    status: ProcessStatus;
    @ApiProperty()
    occupiedById?: string;
    @ApiProperty()
    isRunning: boolean;

    @ApiProperty()
    assignedUserId?: string;

    @ApiProperty()
    steps: Step[];

    constructor(metadata: Metadata, process: ProcessDoc, order: Order) {
        super(metadata);

        this.id = process.id;
        this.companyId = process.companyId;
        this.order = order;
        this.templateId = process.templateId;

        this.name = process.name;
        this.mainTasks = process.mainTasks;
        this.previousComments = process.previousComments;
        this.estimatedTime = process.estimatedTime;
        this.deliveryDate = process.deliveryDate;

        this.releasedAt = process.releasedAt;
        this.startedAt = process.startedAt;
        this.completedAt = process.completedAt;

        this.timeTaken = process.timeTaken;
        this.currentStepIndex = process.currentStepIndex;
        this.status = process.status;
        this.occupiedById = process.occupiedById;
        this.isRunning = process.isRunning;

        this.assignedUserId = process.assignedUserId;

        this.steps = process.steps.map(step => new Step(step));
    }
}