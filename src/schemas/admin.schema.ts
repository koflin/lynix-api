import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { MetadataDocument } from './base';
import { Activatable } from './interfaces/activatable';

/**
 * Represents a admin document
 */
@Schema()
export class AdminDoc extends MetadataDocument implements Activatable { 
    @Prop()
    email: string;
    @Prop()
    passwordEncrypted: string;

    @Prop()
    activatedAt: Date;
    @Prop()
    lastPasswordResetAt: Date;   
}

export const AdminSchema = SchemaFactory.createForClass(AdminDoc);