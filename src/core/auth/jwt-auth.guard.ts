import { CanActivate, ExecutionContext, Injectable, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

import { UsersService } from '../users/users.service';
import { AuthInfo } from './auth-info.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(
        protected jwtService: JwtService,
        protected usersService: UsersService,
        protected config: ConfigService,
    ) {
    }
    
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return new Promise(async (resolve) => {
            const ctx = GqlExecutionContext.create(context);
            const authInfo = await this.authenticate(ctx);

            if (!authInfo) {
                if (!this.config.get('version.prod')) {
                    const account = await this.usersService.getById('5f4411a4e9dc5b57b4a9782b');

                    if (!account) throw new NotImplementedException('Haven\'t found the test user');

                    if (ctx.getType() === 'http') {
                        ctx.switchToHttp().getRequest().account = account;
                    } else if (ctx.getType() === 'ws') {''
                        ctx.switchToWs().getClient().handshake['account'] = account;
                    } else if (ctx.getType() === 'graphql') {
                        ctx.getContext().req.account = account;
                    }

                    return resolve(true);
                }
                return resolve(false);
            }

            if (!await this.authorize(authInfo)) {
                return resolve(false);
            }

            if (ctx.getType() === 'http') {
                ctx.switchToHttp().getRequest().account = authInfo.account;
            } else if (ctx.getType() === 'ws') {
                ctx.switchToWs().getClient().handshake['account'] = authInfo.account;
            } else if (ctx.getType() === 'graphql') {
                ctx.getContext().req.account = authInfo.account;
            }
            
            resolve(true);
        });
    }

    async authorize(authInfo: AuthInfo, ) {
        return true;
    }

    async authenticate(context: GqlExecutionContext, client?: Socket) {
        let token;

        if (client) {
            token = client.handshake.auth['token'];
        } else if (context.getType() === 'http') {
            token = context.switchToHttp().getRequest().cookies['access_token'];
        } else if (context.getType() === 'ws') {
            const socket = context.switchToWs().getClient();
            token = socket.handshake.auth['token'];
        } else if (context.getType() === 'graphql') {
            token = context.getContext().req.cookies['access_token'];
        }

        if (!token || !this.jwtService.verify(token)) {
            return null;
        }

        const decodedToken = this.jwtService.decode(token);
        const type = decodedToken['type'];
        const account = decodedToken['account'];
        
        return {
            account,
            type,
            context
        };
    }
}