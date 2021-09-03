import { Prop, Schema } from '@nestjs/mongoose';

import { UrlDoc } from './url.schema';

/**
 * Represents a step subdocument
 */
@Schema()
export class StepDoc {
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
    pictureUris?: UrlDoc[];
    @Prop()
    videoUris?: UrlDoc[];
    @Prop()
    estimatedTime: number;
    
    @Prop()
    timeTaken: number;
}