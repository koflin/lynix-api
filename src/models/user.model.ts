import { ApiProperty } from '@nestjs/swagger';
import { UserDoc } from 'src/schemas/user.schema';

import { Role } from './role.model';

export class User {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    username: string;
    @ApiProperty()
    firstName?: string;
    @ApiProperty()
    lastName?: string;
    @ApiProperty()
    role?: Role;
    @ApiProperty()
    avatar?: string;

    @ApiProperty()
    activatedAt: Date;

    constructor(user: UserDoc, role: Role) {
        this.id = user.id;
        this.companyId = user.companyId;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = role;
        this.avatar = user.avatar;
        this.activatedAt = user.activatedAt;
    }
}

export type UserStatus = 'online' | 'offline';
export type UserActivity = 'idle' | 'guide';