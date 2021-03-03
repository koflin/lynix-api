import { Permission } from './role.model';

export class LocalUser {
  id: string;
  companyId: string;
  username: string;
  permissions: Permission[];
}
