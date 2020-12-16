import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { string } from "@hapi/joi";

/**
 * Represents a order document
 */
@Schema()
export class OrderDoc extends Document {
    @Prop()
    id: string;
    @Prop()
    companyId: string;

    @Prop()
    status: string;
    @Prop()
    name: string;
    @Prop()
    description?: string;

    @Prop([raw({
        templateId: { type: String },
        quantity: { type: Number }
    })])
    products: {
        templateId: string;
        quantity: number;
    }[];
}

export const OrderSchema =  SchemaFactory.createForClass(OrderDoc);