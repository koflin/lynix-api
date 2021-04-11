import { SetMetadata } from '@nestjs/common';

export const COMPANY_PROTECT_KEY = 'company-protect';
export const CompanyProtect = (...properties: string[]) => SetMetadata(COMPANY_PROTECT_KEY, properties);

