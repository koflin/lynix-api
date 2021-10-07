import { AccountType } from './account-type';

export interface Account {
    id: string;
    email: string;

    type: AccountType;
}