import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotImplementedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { AccountType } from 'src/models/account-type';
import { User } from 'src/models/user.model';

import { AccountService } from '../account/account.service';
import { AuthInfo } from './auth-info.interface';
import { REQUIRED_ACCOUNT_TYPE } from './required-account-type.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private accountService: AccountService,
        @InjectConnection() private connection: Connection,
    ) {
    }
    
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return new Promise(async (resolve) => {
            const authInfo = await this.authenticate(context);

            if (!authInfo) {
                return resolve(false);
            }

            if (!await this.authorize(authInfo)) {
                return resolve(false);
            }

            if (context.getType() === 'http') {
                context.switchToHttp().getRequest().account = authInfo.account;
            } else if (context.getType() === 'ws') {
                context.switchToWs().getClient().handshake['account'] = authInfo.account;
            }
            
            resolve(true);
        });
    }

    async authenticate(context: ExecutionContext, client?: Socket): Promise<AuthInfo> {
        let token;

        if (client) {
            token = client.handshake.auth['token'];
        } else if (context.getType() === 'http') {
            token = context.switchToHttp().getRequest().cookies['access_token'];
        } else if (context.getType() === 'ws') {
            const socket = context.switchToWs().getClient();
            token = socket.handshake.auth['token'];
        }
  
        if (!token || !this.jwtService.verify(token)) {
            return null;
        }

        const decodedToken = this.jwtService.decode(token);
        const type = decodedToken['type'];
        const account = decodedToken['account'];
        
        return {
            account: this.accountService.getById(account.id, type === AccountType.ADMIN),
            type,
            context
        };
    }

    async authorize(authInfo: AuthInfo): Promise<boolean> {
        const { context, type, account } = authInfo;

        // Check if account type matches provided account
        const requiredAccountType = this.reflector.getAllAndOverride<AccountType[]>(REQUIRED_ACCOUNT_TYPE, [
            context.getHandler(),
            context.getClass()
        ]);

        // Unauthorized account type
        if (requiredAccountType.length > 0 && requiredAccountType.indexOf(type) === -1) {
            throw new ForbiddenException(undefined, 'Unauthorized account type. Needs one of: ' + requiredAccountType.join(', '));
        }

        // Account type specific authorization
        if (type === AccountType.ADMIN) {
            return true;
        } else if (type === AccountType.USER) {
            if (context.getType() === 'http') {
                const metadata = Reflect.getMetadata("__routeArguments__", context.getClass(), context.getHandler().name);
                const request = context.switchToHttp().getRequest();
    
                for (const key in metadata) {
                    const keyType = parseInt(key.split(':')[0]);
                    const prop = metadata[key].data;
    
                    let value;
    
                    // Param
                    if (keyType === 5) {
                        value = request.params[prop];
                    }
                    // Query
                    else if (keyType === 4) {
                        value = request.query[prop];
                    }
    
                    if (value != undefined && !await this.checkResource(value, account)) {
                        throw new ForbiddenException(undefined, 'Unauthorized. This resource belongs to a different company');
                    }
                }
            }

            return true;
        } else {
            throw new NotImplementedException();
        }
    }

    private async checkResource(value: any, user: User) {
        // Array value
        if (Array.isArray(value)) {
            for (const subValue of value) {
                if (!this.checkResource(subValue, user)) {
                    return false;
                }
            }
    
            return true;
        }

        if (!mongoose.Types.ObjectId.isValid(value)) {
            return true;
        }

        if (value == user.companyId) {
            return true;
        }
    
        const collections = await this.connection.db.collections();
            
        for (const col of collections) {
            const result = await col.findOne({ "_id": new mongoose.Types.ObjectId(value) });

            if (result && result.companyId == user.companyId) {
                return true;
            }
        }
    
        return false;
    }
}