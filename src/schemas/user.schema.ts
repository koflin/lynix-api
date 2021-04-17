import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserActivity, UserStatus } from 'src/models/user.model';

/**
 * Represents a user document
 */
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

    @Prop()
    lastSeen: Date;
    @Prop()
    activity: UserActivity;
    @Prop()
    status: UserStatus;

    @Prop()
    activatedAt: Date;
    @Prop()
    lastPasswordResetAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDoc);