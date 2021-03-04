import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    getRequest<T = any>(context: ExecutionContext): T {
        return context.switchToHttp().getRequest();
    }
}