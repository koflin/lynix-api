import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MetadataDocument } from './base';

@Schema()
export class ToolDoc extends MetadataDocument {
    @Prop()
    companyId: string;

    @Prop()
    title: string;
    @Prop()
    name: string;
}

export const ToolSchema = SchemaFactory.createForClass(ToolDoc);