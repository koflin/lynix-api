import { Resolver } from '@nestjs/graphql';
import { Role } from 'src/models/role.model';

import { RolesService } from './roles.service';

@Resolver(of => Role)
export class RolesResolver {
    constructor(private rolesSerivce: RolesService) {

    }
}
