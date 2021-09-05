import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MetadataDocument } from './base';

/**
 * Represents a admin document
 */
@Schema()
export class AdminDoc extends MetadataDocument {    
    @Prop()
    email: string;
    @Prop()
    passwordEncrypted: string;
}

export const AdminSchema = SchemaFactory.createForClass(AdminDoc);