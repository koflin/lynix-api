import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
            //ingoreExpiration: false,
            ingoreExpiration: true,
            secretOrKey: jwtConstants.secret
        });
    }

    async validate(payload: any) {
        console.log(payload);
        return this.usersService.getById(payload['sub']);
    }
}