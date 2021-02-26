import { Permission } from './../models/role.model';

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class RoleDoc extends Document {
    @Prop()
    companyId: string;

    @Prop()
    name: string;
    @Prop([String])
    permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleDoc);