import { AccountType } from 'src/models/account-type';

export interface Activatable {
    email: string;
    passwordEncrypted: string;
    
    activatedAt: Date;
    lastPasswordResetAt: Date;

    type: AccountType;
}