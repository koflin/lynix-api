import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private usersService: UsersService,
        private config: ConfigService
    ) {
        super({
            jwtFromRequest: (req: any) => {
                const accessToken = req.cookies['access_token'];
                let loggedIn = req.cookies['logged_in_until'];
                loggedIn = loggedIn ? parseInt(loggedIn) : 0;

                if (loggedIn < Date.now()) {
                    return null;
                }

                return accessToken;
            },
            ingoreExpiration: false,
            secretOrKey: config.get('jwt.secret')
        });
    }

    async validate(payload: any) {
        return this.usersService.getById(payload['sub']);
    }
}