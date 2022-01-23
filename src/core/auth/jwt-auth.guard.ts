import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

import { AuthInfo } from './auth-info.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {
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

    async authorize(authInfo: AuthInfo, ) {
        return true;
    }

    async authenticate(context: ExecutionContext, client?: Socket) {
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

        if (!decodedToken) {
            return null;
        }

        const type = decodedToken['type'];
        const account = decodedToken['account'];
        
        return {
            account,
            type,
            context
        };
    }
}