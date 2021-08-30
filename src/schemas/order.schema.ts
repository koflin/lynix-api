import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
    description?: any;
    @Prop()
    deliveryDate: Date;

    @Prop()
    releasedAt: Date;
    @Prop()
    startedAt: Date;
    @Prop()
    completedAt: Date;

    @Prop()
    products: {
        templateId: string;
        quantity: number;
    }[];
}

export const OrderSchema =  SchemaFactory.createForClass(OrderDoc);