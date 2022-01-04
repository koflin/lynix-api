import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/models/role.model';

import { RolesService } from './roles.service';

@Resolver(of => Role)
export class RolesResolver {
    constructor(private rolesSerivce: RolesService) {

    }

    @Query(returns => Role, { name: 'role' })
    async getRole(@Args('id', { type: () => ID }) id: string) {
        return this.rolesSerivce.getById(id);
    }
}
