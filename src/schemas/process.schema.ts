import { ProcessTemplateDoc } from './processTemplate.schema';
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { StepDoc } from "./step.schema";
import { Document } from "mongoose";

@Schema()
export class ProcessDoc extends Document {
    @Prop()
    id: string;
    @Prop()
    companyId: string;

    @Prop()
    orderId: string;
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
    status: string;
    @Prop()
    isOccupied: boolean;
    @Prop()
    isRunning: boolean;

    @Prop()
    assignedUserId: string;

    @Prop([StepDoc])
    steps: StepDoc[];
}

export const ProcessSchema = SchemaFactory.createForClass(ProcessDoc);