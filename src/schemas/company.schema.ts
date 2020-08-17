import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CompanyDoc extends Document {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    logo: string;
}

export const CompanySchema = SchemaFactory.createForClass(CompanyDoc);