import { ExecutionContext } from '@nestjs/common';

export interface AuthInfo {
    account: any;
    type: AuthAccountType,
    context: ExecutionContext
}

export type AuthAccountType = 'user' | 'admin';