import { User } from 'src/models/user.model';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class CompaniesGuard implements CanActivate {

  constructor(
    @InjectConnection() private connection: Connection
  ) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const params = context.switchToHttp().getRequest().params;
    const id = params[Object.keys(params)[0]];

    if (!id) {
      return true;
    }

    const user: User = context.switchToHttp().getRequest().user;

    return new Promise(async (resolve) => {
      const collections = await this.connection.db.collections();
      
      for (let col of collections) {
        let result = await col.findOne({ "_id": new mongoose.Types.ObjectId(id) });

        if (result && result.companyId == user.companyId) {
          resolve(true);
          return;
        }
      }

      resolve(false);
    });
  }
}