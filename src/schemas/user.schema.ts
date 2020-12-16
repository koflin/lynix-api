import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserDoc extends Document {
    @Prop()
    companyId: string;
    
    @Prop()
    username: string;
    @Prop()
    passwordEncrypted: string;
    @Prop()
    firstName?: string;
    @Prop()
    lastName?: string;
    @Prop()
    roleId?: string;
    @Prop()
    avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDoc);