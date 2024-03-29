import { ApiProperty } from '@nestjs/swagger';
import { UrlDoc } from 'src/schemas/url.schema';
import { UserDoc } from 'src/schemas/user.schema';

import { Metadata } from './base/metadata.interface';
import { MetadataEntity } from './base/metadata.model';
import { Company } from './company.model';
import { Role } from './role.model';

export class User extends MetadataEntity {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    email: string;
    @ApiProperty()
    displayName?: string;
    @ApiProperty()
    firstName?: string;
    @ApiProperty()
    lastName?: string;
    @ApiProperty()
    role?: Role;
    @ApiProperty()
    avatar?: string;

    @ApiProperty()
    companyLogo?: string;

    @ApiProperty()
    activatedAt: Date;

    constructor(user: UserDoc, metadata?: Metadata, role?: Role, company?: Company) {
        super(metadata);
        
        this.id = user.id;
        this.companyId = user.companyId;
        this.email = user.email;
        this.displayName = user?.firstName + ' ' + user?.lastName;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = role;
        this.avatar = UrlDoc.to(user.avatar);
        this.companyLogo = company?.logo;
        this.activatedAt = user.activatedAt;
    }
}

export type UserStatus = 'online' | 'offline';
export type UserActivity = 'idle' | 'guide';