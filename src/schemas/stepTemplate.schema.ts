import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UrlDoc } from './url.schema';

/**
 * Represents a step template subdocument
 */
@Schema({ _id: false })
export class StepTemplateDoc extends Document {
    @Prop()
    title: string;
    @Prop()
    materials: string[];
    @Prop()
    toolIds: string[];
    @Prop({ type: Object})
    keyMessage: any;
    @Prop({ type: Object})
    tasks: any;
    @Prop()
    pictureUris?: UrlDoc[];
    @Prop()
    videoUris?: UrlDoc[];
    @Prop()
    estimatedTime: number;
}

export const StepTemplateSchema = SchemaFactory.createForClass(StepTemplateDoc);