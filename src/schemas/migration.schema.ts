import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class MigrationDoc extends Document {
    @Prop()
    version: string;

    @Prop()
    updatedFrom: string;

    @Prop()
    updatedAt: Date;
}

export const MigrationSchema = SchemaFactory.createForClass(MigrationDoc);