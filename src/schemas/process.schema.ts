import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProcessStatus } from 'src/models/enums/processStatus.enum';

import { MetadataDocument } from './base';
import { ProcessTemplateDoc } from './processTemplate.schema';
import { StepDoc } from './step.schema';

/**
 * Represents a process document
 */
@Schema()
export class ProcessDoc extends MetadataDocument {
    @Prop()
    companyId: string;

    @Prop()
    orderId: string;
    @Prop()
    templateId: string;
    @Prop()
    template: ProcessTemplateDoc;

    @Prop()
    name: string;
    @Prop([String])
    mainTasks: string[];
    @Prop([String])
    previousComments: string[];
    @Prop()
    estimatedTime: number;
    @Prop()
    deliveryDate: Date;

    @Prop()
    timeTaken: number;
    @Prop()
    currentStepIndex: number;
    @Prop({ type: String, enum: Object.values(ProcessStatus) })
    status: ProcessStatus;
    @Prop()
    occupiedById: string;
    @Prop()
    isRunning: boolean;

    @Prop()
    releasedAt: Date;
    @Prop()
    startedAt: Date;
    @Prop()
    completedAt: Date;

    @Prop()
    assignedUserId: string;

    @Prop([StepDoc])
    steps: StepDoc[];
}

export const ProcessSchema = SchemaFactory.createForClass(ProcessDoc);