import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/**
 * Represents a product template document
 */
@Schema()
export class ProductTemplateDoc extends Document {
    @Prop()
    companyId: string;

    @Prop()
    name: string;

    @Prop()
    processes: {
        templateId: string;
        quantity: number;
    }[]
}

export const ProductTemplateSchema = SchemaFactory.createForClass(ProductTemplateDoc);