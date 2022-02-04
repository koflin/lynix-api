import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from 'src/models/enums/orderStatus.enum';

import { MetadataDocument } from './base';

/**
 * Represents a order document
 */
@Schema()
export class OrderDoc extends MetadataDocument {
    @Prop()
    companyId: string;

    @Prop({ type: String, enum: Object.values(OrderStatus) })
    status: OrderStatus;
    @Prop()
    name: string;
    @Prop({ type: Object})
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