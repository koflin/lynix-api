import { Permission } from '../../models/role.model';
import { IsEnum, IsIn, IsNotEmpty, IsOptional } from "class-validator";

export class EditRoleDto {
    @IsNotEmpty()
    name: string;
    @IsOptional()
    @IsEnum(Permission, { each: true })
    permissions: Permission[];
}