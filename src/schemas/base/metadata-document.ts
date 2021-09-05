import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MetadataDocument extends Document {
    @Prop()
    createdAt: Date;

    @Prop()
    createdBy: string;

    @Prop()
    editedAt: Date;

    @Prop()
    editedBy: string;

    @Prop()
    deletedAt: Date;

    @Prop()
    deletedBy: string;
}