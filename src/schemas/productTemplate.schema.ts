import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MetadataDocument } from './base';

/**
 * Represents a product template document
 */
@Schema()
export class ProductTemplateDoc extends MetadataDocument {
    @Prop()
    companyId: string;

    @Prop()
    name: string;

    @Prop()
    description?: any;

    @Prop()
    processes: {
        templateId: string;
        quantity: number;
    }[];

    @Prop()
    deletedAt: Date;
}

export const ProductTemplateSchema = SchemaFactory.createForClass(ProductTemplateDoc);