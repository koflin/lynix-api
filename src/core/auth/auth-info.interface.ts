import { ExecutionContext } from '@nestjs/common';
import { AccountType } from 'src/models/account-type';

export interface AuthInfo {
    account: any;
    type: AccountType,
    context: ExecutionContext
}