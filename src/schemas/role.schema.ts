
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class RoleDoc extends Document {
    @Prop()
    id: string;
    @Prop()
    companyId: string;

    @Prop()
    name: string;
    @Prop([String])
    permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleDoc);