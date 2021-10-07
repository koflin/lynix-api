import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';

import { REQUIRED_PERMISSIONS_KEY } from './required-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<(Permission | Permission[])[]>(REQUIRED_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const user: User = context.switchToHttp().getRequest().account;

    if (!user) {
      return false;
    }

    const hasPermissions = user.role?.hasPermission(...requiredPermissions);

    if (!hasPermissions) {
      throw new ForbiddenException(undefined, 'Missing permissions. Needs one of: ' + requiredPermissions.join(', '));
    }

    return true;
  }
}
