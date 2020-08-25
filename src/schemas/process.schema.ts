import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { StepDoc } from "./step.schema";

@Schema()
export class ProcessDoc {
    @Prop()
    name: string;
    @Prop([String])
    mainTasks: string[];
    @Prop()
    previousComments: string;
    @Prop()
    estimatedTime: number;
    @Prop()
    timeTaken: number;
    @Prop([StepDoc])
    steps: StepDoc[];
}

export const ProcessSchema = SchemaFactory.createForClass(ProcessDoc);