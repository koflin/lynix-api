import { ApiProperty } from "@nestjs/swagger";

export class Role {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;
    @ApiProperty()
    premissions: Permission[];
}

export type Permission = 'view' | 'execute' | 'edit' | 'assign';