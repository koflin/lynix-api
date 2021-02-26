import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { use } from 'passport';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {

    }

    async validateUser(username: string, password: string) {
        let user = await this.usersService.getByUsername(username);

        // Change to encrypted
        if (user && user.passwordEncrypted === password) {
            return this.usersService.getById(user.id);
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

            user: {
                id: user.id,
                companyId: user.companyId,
                username: user.username
            }
        };

        return {
            access_token: this.jwtService.sign(payload),
            user
        };
    }
}
