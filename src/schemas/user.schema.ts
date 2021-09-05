import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserActivity, UserStatus } from 'src/models/user.model';

import { MetadataDocument } from './base';
import { UrlDoc } from './url.schema';

/**
 * Represents a user document
 */
@Schema()
export class UserDoc extends MetadataDocument {
    @Prop()
    companyId: string;
    
    @Prop()
    email: string;
    @Prop()
    passwordEncrypted: string;
    @Prop()
    firstName?: string;
    @Prop()
    lastName?: string;
    @Prop()
    roleId?: string;
    @Prop()
    avatar?: UrlDoc;

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