import { Permission } from './role.model';

export class LocalUser {
  id: string;
  companyId: string;
  email: string;
  permissions: Permission[];
}
