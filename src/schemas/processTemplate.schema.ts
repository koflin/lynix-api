import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { StepDoc } from "./step.schema";
import { Document } from "mongoose";

@Schema()
export class ProcessTemplateDoc extends Document {
    @Prop()
    id: string;
    @Prop()
    companyId: string;

    @Prop()
    name: string;
    @Prop()
    mainTasks: string[];
    @Prop([String])
    previousComments?: string[];

    @Prop([{
        title: { type: String },
        materials: { type: [String] },
        toolIds: { type: [String]  },
        keyMessage: { type: String },
        tasks: { type: String },
        pictureUris: { type: [String] },
        videoUris: { type: [String] },
        estimatedTime: { type: Number }
    }])
    stepTemplates: {
        title: string;
        materials: string[];
        toolIds: string[];
        keyMessage: string;
        tasks: string;
        pictureUris?: string[];
        videoUris?: string[];
        estimatedTime: number;
    }[];
}

export const ProcessTemplateSchema = SchemaFactory.createForClass(ProcessTemplateDoc);