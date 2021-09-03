import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { StepTemplateDoc } from './stepTemplate.schema';

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
    stepTemplates: StepTemplateDoc[];

    @Prop()
    deletedAt: Date;
}

export const ProcessTemplateSchema = SchemaFactory.createForClass(ProcessTemplateDoc);