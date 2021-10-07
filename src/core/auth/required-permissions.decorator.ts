import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/models/role.model';

export const REQUIRED_PERMISSIONS_KEY = 'required_permissions';
export const RequiredPermissions = (...permissions: (Permission | Permission[])[]) => SetMetadata(REQUIRED_PERMISSIONS_KEY, permissions);