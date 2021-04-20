import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService
    ) {
    }

    async validateUser(username: string, password: string) {
        let user = await this.usersService.getByUsername(username);

        // Change to encrypted on production
        if (user && user.passwordEncrypted && (user.passwordEncrypted === password || await bcrypt.compare(password, user.passwordEncrypted))) {
            return this.usersService.getById(user.id);
        }

        return null;
    }

    async tokenFromUser(user: User, persist: boolean) {
        const payloadToken = {
            // Issuer
            iss: this.config.get('jwt.issuer'),
            // Subject
            sub: user.id,
            // Issued at
            iat: new Date().getTime(),

            user: {
                id: user.id,
                companyId: user.companyId,
                username: user.username,
                permissions: user.role.permissions
            },

            persist: persist
        };

        const payloadRefreshToken = {
            // Issuer
            iss: this.config.get('jwt.issuer'),
            // Subject
            sub: user.id,
            // Issued at
            iat: new Date().getTime(),

            persist: persist
        }

        const accessToken = this.jwtService.sign(payloadToken, { expiresIn: this.config.get<number>('jwt.tokenExpiration') * 1000 });
        const refreshToken = this.jwtService.sign(payloadRefreshToken, { expiresIn: this.config.get<number>('jwt.refreshTokenExpiration') * 1000 });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: payloadToken.user,
            refresh_expiration : this.jwtService.decode(refreshToken)['exp'],
            access_expiration: this.jwtService.decode(accessToken)['exp'],
            persist: persist
        };
    }

    async tokenFromRefresh(refreshToken: string) {
        if (!refreshToken || !this.jwtService.verify(refreshToken)) {
            return null;
        }

        const decoded = this.jwtService.decode(refreshToken);
        const id = decoded['sub'];

        if (!id) {
            return null;
        }

        const user = await this.usersService.getById(id);

        if (!user) {
            return null;
        }

        const persist = decoded['persist'];

        return this.tokenFromUser(user, persist);
    }

    getInfo(token: string) {
        const decoded = this.jwtService.decode(token);
        
        return {
            expiration: decoded['exp'],
            persist: decoded['persist']
        };
    }
}
