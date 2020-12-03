import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class ProductTemplateDoc extends Document {
    @Prop()
    id: string;
    @Prop()
    companyId: string;

    @Prop()
    name: string;

    @Prop([{
        templateId: { type: String },
        quantity: { type: Number }
    }])
    processes: {
        templateId: string;
        quantity: number;
    }
}

export const ProductTemplateSchema = SchemaFactory.createForClass(ProductTemplateDoc);