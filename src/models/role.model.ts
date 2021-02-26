import { ApiProperty } from "@nestjs/swagger";
import { RoleDoc } from "src/schemas/role.schema";

export class Role {
    @ApiProperty()
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;
    @ApiProperty()
    permissions: Permission[];

    constructor(doc: RoleDoc) {
        this.id = doc.id;
        this.companyId = doc.companyId;
        this.name = doc.name;
        this.permissions = doc.permissions;
    }
}

export enum Permission {
    VIEW = 'view',
    EXECUTE = 'execute',
    EDIT = 'edit',
    ASSIGN = 'assign'
}