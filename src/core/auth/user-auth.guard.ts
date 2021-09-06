import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { Socket } from 'socket.io';
import { User } from 'src/models/user.model';

import { UsersService } from '../users/users.service';
import { AuthInfo } from './auth-info.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class UserAuthGuard extends JwtAuthGuard {
    constructor(    
        jwtService: JwtService,
        private usersService: UsersService,
        private reflector: Reflector,
        @InjectConnection() private connection: Connection,
    ) {
        super(jwtService);
    }
 
    async authenticate(context: ExecutionContext, client?: Socket) {
        const auth = await super.authenticate(context, client);
        auth.account = await this.usersService.getById(auth.account.id);
        return auth;
    }

    async authorize(authInfo: AuthInfo) {
        const { type, context, account } = authInfo;

        if (type !== 'user') {
            return false;
        }

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
                    return false;
                }
            }
        }
        
        return true;
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