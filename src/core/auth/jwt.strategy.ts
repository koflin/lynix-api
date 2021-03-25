import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private usersService: UsersService,
        private config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ingoreExpiration: false,
            //ingoreExpiration: true,
            secretOrKey: config.get('jwt.secret')
        });
    }

    async validate(payload: any) {
        return this.usersService.getById(payload['sub']);
    }
}