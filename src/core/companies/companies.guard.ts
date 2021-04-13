import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { Observable } from 'rxjs';
import { LocalUser } from 'src/models/localUser.model';

import { COMPANY_PROTECT_KEY } from './company-protect.decorator';

@Injectable()
export class CompaniesGuard implements CanActivate {

  constructor(
    @InjectConnection() private connection: Connection,
    private reflector: Reflector
  ) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const properties = this.reflector.getAllAndOverride<string[]>(COMPANY_PROTECT_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!properties || properties.length == 0) {
      return true;
    }

    const user: LocalUser = context.switchToHttp().getRequest().user;
    const params = context.switchToHttp().getRequest().params;
    const body = context.switchToHttp().getRequest().body;

    for (const prop of properties) {
      const paramValue = params[prop];
      const bodyValue = body[prop];

      if (paramValue && mongoose.Types.ObjectId.isValid(paramValue)) {
        if (!this.check(paramValue, user)) {
          return false;
        }
      }

      if (bodyValue && mongoose.Types.ObjectId.isValid(bodyValue)) {
        if (!this.check(bodyValue, user)) {
          return false;
        }
      }
    }

    return true;
  }

  async check(value: any, user: LocalUser) {
    // Array value
    if (Array.isArray(value)) {
      for (const subValue of value) {
        if (!this.check(subValue, user)) {
          return false;
        }
      }

      return true;
    }

    const collections = await this.connection.db.collections();
      
    for (let col of collections) {
      let result = await col.findOne({ "_id": new mongoose.Types.ObjectId(value) });

      if (result && result.companyId == user.companyId) {
        return true;
      }
    }

    return false;
  }
}
