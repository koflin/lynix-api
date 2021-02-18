import { StepTemplate } from 'src/models/stepTemplate.model';
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { StepTemplateDoc } from "./stepTemplate.schema";

/**
 * Represents a process template document
 */
@Schema()
export class ProcessTemplateDoc extends Document {
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
    stepTemplates: StepTemplate[];
}

export const ProcessTemplateSchema = SchemaFactory.createForClass(ProcessTemplateDoc);