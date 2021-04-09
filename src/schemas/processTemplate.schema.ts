import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StepTemplate } from 'src/models/stepTemplate.model';

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

    @Prop()
    stepTemplates: StepTemplate[];

    @Prop()
    deletedAt: Date;
}

export const ProcessTemplateSchema = SchemaFactory.createForClass(ProcessTemplateDoc);