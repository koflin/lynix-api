import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('ws-jwt') {
    getRequest<T = any>(context: ExecutionContext): T {
        console.log(context.switchToWs().getClient());
        return context.switchToWs().getClient().handshake;
    }
}