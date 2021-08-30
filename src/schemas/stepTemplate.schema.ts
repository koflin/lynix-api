import { Prop, Schema } from '@nestjs/mongoose';

/**
 * Represents a step template subdocument
 */
@Schema()
export class StepTemplateDoc {
    @Prop()
    title: string;
    @Prop()
    materials: string[];
    @Prop()
    toolIds: string[];
    @Prop()
    keyMessage: any;
    @Prop()
    tasks: any;
    @Prop()
    pictureUris?: string[];
    @Prop()
    videoUris?: string[];
    @Prop()
    estimatedTime: number;
}