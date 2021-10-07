import { SetMetadata } from '@nestjs/common';
import { AccountType } from 'src/models/account-type';

export const REQUIRED_ACCOUNT_TYPE = 'required_account_Type';
export const RequiredAccountType = (...accountTypes: AccountType[]) => SetMetadata(REQUIRED_ACCOUNT_TYPE, accountTypes);