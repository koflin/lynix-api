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
    ORDER_VIEW = 'order_view',
    ORDER_EDIT = 'order_edit',

    PROCESS_VIEW = 'process_view',
    PROCESS_EXECUTE = 'process_execute',
    PROCESS_ASSIGN = 'process_assign',

    MANUAL_VIEW = 'manual_view',

    TEMPLATE_VIEW = 'template_view',
    TEMPLATE_EDIT = 'template_edit',

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