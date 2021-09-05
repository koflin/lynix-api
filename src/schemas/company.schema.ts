import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UrlDoc } from 'src/schemas/url.schema';

import { MetadataDocument } from './base';

/**
 * Represents a company document
 */
@Schema()
export class CompanyDoc extends MetadataDocument {
    @Prop()
    name: string;

    @Prop()
    logo?: UrlDoc;
}

export const CompanySchema = SchemaFactory.createForClass(CompanyDoc);