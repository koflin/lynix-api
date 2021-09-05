import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Permission } from './../models/role.model';
import { MetadataDocument } from './base';

@Schema()
export class RoleDoc extends MetadataDocument {
    @Prop()
    companyId: string;

    @Prop()
    name: string;
    @Prop([String])
    permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleDoc);