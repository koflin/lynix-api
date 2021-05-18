import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Represents a admin document
 */
@Schema()
export class AdminDoc extends Document {    
    @Prop()
    email: string;
    @Prop()
    passwordEncrypted: string;
}

export const AdminSchema = SchemaFactory.createForClass(AdminDoc);