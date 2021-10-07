import { ApiProperty } from '@nestjs/swagger';
import { AdminDoc } from 'src/schemas/admin.schema';

import { Account } from './account';
import { AccountType } from './account-type';

export class Admin implements Account {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    email: string;

    @ApiProperty()
    type = AccountType.ADMIN;

    constructor(admin: AdminDoc) {
        this.id = admin.id;
        this.email = admin.email;
    }
}