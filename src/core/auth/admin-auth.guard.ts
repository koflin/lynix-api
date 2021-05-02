import { Injectable } from '@nestjs/common';

import { AuthInfo } from './auth-info.interface';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminAuthGuard extends JwtAuthGuard {
    async authorize(authInfo: AuthInfo) {
        if (authInfo.type !== 'admin') {
            return false;
        }

        return true;
    }
}