import { ProcessTemplateDoc } from './processTemplate.schema';
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { StepDoc } from "./step.schema";
import { Document } from "mongoose";
import { ProcessTemplate } from 'src/models/processTemplate';

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
    timeTaken: number;
    @Prop()
    currentStepIndex: number;
    @Prop()
    status: 'in_preparation' | 'released' | 'in_progress' | 'completed' | 'assistance_required';
    @Prop()
    isOccupied: boolean;
    @Prop()
    isRunning: boolean;

    @Prop()
    assignedUserId: string;

    @Prop()
    steps: StepDoc[];
}

export const ProcessSchema = SchemaFactory.createForClass(ProcessDoc);