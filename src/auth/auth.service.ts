import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {

    }

    async validateUser(username: string, password: string) {
        let user = await this.usersService.getByUsername(username);

        // Change to encrypted
        if (user && user.passwordEncrypted === password) {
            return new User(user);
        }

        return null;
    }

    async login(user: User) {
        let payload = {
            // Issuer
            iss: 'api.lynix.ch',
            // Subject
            sub: user.id,
            // Issued at
            iat: new Date().getTime(),
            companyId: user.companyId,
            roleId: user.roleId
        };

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
