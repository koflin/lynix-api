import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class ToolDoc extends Document {
    @Prop()
    companyId: string;

    @Prop()
    title: string;
    @Prop()
    name: string;
}

export const ToolSchema = SchemaFactory.createForClass(ToolDoc);