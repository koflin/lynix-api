import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UrlDoc } from 'src/schemas/url.schema';

@Schema()
export class MediaDoc extends Document {
    @Prop()
    companyId: string;

    @Prop()
    uploadedBy: string;
    @Prop()
    uploadedAt: Date;

    @Prop()
    url: UrlDoc;

    @Prop()
    fileName: string;
}

export const MediaSchema =  SchemaFactory.createForClass(MediaDoc);