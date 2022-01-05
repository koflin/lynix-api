import { Args, Query, Resolver } from '@nestjs/graphql';
import { Permission } from 'src/models/role.model';
import { User } from 'src/models/user.model';

import { RolesService } from '../roles/roles.service';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(
        private usersService: UsersService,
        private rolesService: RolesService
    ) {

    }

    @Query(returns => [User], { name: 'withPermission' })
    async getWithPermission(@Args('permissions', { type: () => [Permission] }) permissions: Permission[], @Args('companyId') companyId: string) {
        const roles = await this.rolesService.getAll(companyId, permissions);
        return this.usersService.getAll(companyId, roles);
    }
}
