import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { RoleDoc } from 'src/schemas/role.schema';

import { Metadata } from './base/metadata.interface';
import { MetadataEntity } from './base/metadata.model';

@ObjectType()
export class Role extends MetadataEntity {
    @ApiProperty()
    @Field(type => ID)
    id: string;
    @ApiProperty()
    companyId: string;
    
    @ApiProperty()
    name: string;
    @ApiProperty()
    permissions: Permission[];

    constructor(metadata: Metadata, doc: RoleDoc) {
        super(metadata);
        
        this.id = doc.id;
        this.companyId = doc.companyId;
        this.name = doc.name;
        this.permissions = doc.permissions;
    }

    hasPermission(...requiredPermissions: (Permission | Permission[])[]) {
        return requiredPermissions.some((permission) => {
            if (Array.isArray(permission)) {
                return permission.every((p => this.permissions.includes(p))); 
            }
    
            return this.permissions.includes(permission);
        });
    }
}

export enum Permission {
    ORDER_VIEW = 'ORDER_VIEW',
    ORDER_EDIT = 'ORDER_EDIT',

    PROCESS_VIEW = 'PROCESS_VIEW',
    PROCESS_EXECUTE = 'PROCESS_EXECUTE',
    PROCESS_ASSIGN = 'PROCESS_ASSIGN',

    MANUAL_VIEW = 'MANUAL_VIEW',

    TEMPLATE_VIEW = 'TEMPLATE_VIEW',
    TEMPLATE_EDIT = 'TEMPLATE_EDIT',

    USER_VIEW = 'user_view',
    USER_EDIT = 'user_edit',

    ROLE_VIEW = 'role_view',
    ROLE_EDIT = 'role_edit',

    STATISTIC_VIEW = 'statistic_view',

    TOOL_EDIT = 'tool_edit',
    
    TESTING_VIEW = 'testing_view'
}

registerEnumType(Permission, {
    name: 'Permission'
});