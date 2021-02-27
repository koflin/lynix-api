import { SetMetadata } from "@nestjs/common";
import { Permission } from "src/models/role.model";

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);