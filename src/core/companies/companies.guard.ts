import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
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
