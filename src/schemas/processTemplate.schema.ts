import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MetadataDocument } from './base';
import { StepTemplateDoc } from './stepTemplate.schema';

/**
 * Represents a process template document
 */
@Schema()
export class ProcessTemplateDoc extends MetadataDocument {
    @Prop()
    companyId: string;

    @Prop()
    name: string;
    @Prop()
    mainTasks: string[];
    @Prop([String])
    previousComments?: string[];

    @Prop([StepTemplateDoc])
    steps: StepTemplateDoc[];

    @Prop()
    deletedAt: Date;
}

export const ProcessTemplateSchema = SchemaFactory.createForClass(ProcessTemplateDoc);