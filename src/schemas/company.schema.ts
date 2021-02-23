import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Represents a company document
 */
@Schema()
export class CompanyDoc extends Document {
    @Prop()
    name: string;

    @Prop()
    logo: string;
}

export const CompanySchema = SchemaFactory.createForClass(CompanyDoc);