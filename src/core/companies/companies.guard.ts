import { User } from 'src/models/user.model';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';

@Injectable()
export class CompaniesGuard implements CanActivate {

  constructor(
    @InjectConnection() private connection: Connection
  ) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const id = context.switchToHttp().getRequest().params[0];

    if (!id) {
      return true;
    }

    const user: User = context.switchToHttp().getRequest().user;

    return Promise.all(
      this.connecti
    )
  }
}
