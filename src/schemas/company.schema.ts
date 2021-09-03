import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UrlDoc } from 'src/schemas/url.schema';

/**
 * Represents a company document
 */
@Schema()
export class CompanyDoc extends Document {
    @Prop()
    name: string;

    @Prop()
    logo?: UrlDoc;
}

export const CompanySchema = SchemaFactory.createForClass(CompanyDoc);