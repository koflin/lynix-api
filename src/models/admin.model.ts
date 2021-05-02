import { ApiProperty } from '@nestjs/swagger';
import { AdminDoc } from 'src/schemas/admin.schema';

export class Admin {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    email: string;

    constructor(admin: AdminDoc) {
        this.id = admin.id;
        this.email = admin.email;
    }
}