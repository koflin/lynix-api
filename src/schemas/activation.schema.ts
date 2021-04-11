import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ActivationDoc extends Document {
    @Prop()
    companyId: string;
    
    @Prop()
    userId: string;
    @Prop()
    code: string;
    @Prop()
    type: 'activation' | 'reset';
}

export const ActivationSchema = SchemaFactory.createForClass(ActivationDoc);