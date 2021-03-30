import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MediaDoc extends Document {
    @Prop()
    companyId: string;

    @Prop()
    uploadedBy: string;
    @Prop()
    uploadedAt: Date;

    @Prop()
    url: string;

    @Prop()
    fileName: string;
}

export const MediaSchema =  SchemaFactory.createForClass(MediaDoc);