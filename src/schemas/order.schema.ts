import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { ProductDoc } from "./product.schema";
import { Document } from "mongoose";

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
    @Prop([ProductDoc])
    products: ProductDoc[];
}

export const OrderSchema =  SchemaFactory.createForClass(OrderDoc);