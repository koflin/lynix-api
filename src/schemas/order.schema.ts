import { Schema, SchemaFactory, Prop, raw } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { string } from "@hapi/joi";

/**
 * Represents a order document
 */
@Schema()
export class OrderDoc extends Document {
    @Prop()
    companyId: string;

    @Prop()
    status: 'in_preparation' | 'released' | 'in_progress' | 'completed';
    @Prop()
    name: string;
    @Prop()
    description?: object;
    @Prop()
    deliveryDate: Date;

    @Prop()
    products: {
        templateId: string;
        quantity: number;
    }[];
}

export const OrderSchema =  SchemaFactory.createForClass(OrderDoc);