import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ProcessTemplateDoc } from './processTemplate.schema';
import { StepDoc } from './step.schema';

/**
 * Represents a process document
 */
@Schema()
export class ProcessDoc extends Document {
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
    @Prop()
    status: 'in_preparation' | 'released' | 'in_progress' | 'completed' | 'assistance_required';
    @Prop()
    occupiedBy: string;
    @Prop()
    isRunning: boolean;

    @Prop()
    assignedUserId: string;

    @Prop([StepDoc])
    steps: StepDoc[];
}

export const ProcessSchema = SchemaFactory.createForClass(ProcessDoc);