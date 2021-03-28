import { Controller, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from 'src/models/user.model';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private config: ConfigService
    ) {

    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: { user: User }, @Res() res: Response) {
        const { access_token, refresh_token, user, refresh_expiration } = await this.authService.tokenFromUser(req.user);
        
        this.setCookies(res, refresh_token, access_token, refresh_expiration);

        res.status(HttpStatus.OK).json({ access_token, user, refresh_expiration });
    }

    @Post('token')
    async token(@Req() req, @Res() res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        let loggedIn = req.cookies['logged_in_until'];
        loggedIn = loggedIn ? parseInt(loggedIn) : 0;

        if (loggedIn < Date.now()) {
            throw new UnauthorizedException('Invalid refresh token!');
        }

        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token provided!');
        }

        const response = await this.authService.tokenFromRefresh(refreshToken);

        if (!response) {
            throw new UnauthorizedException('Invalid refresh token!');
        }

        const { access_token, refresh_token, user, refresh_expiration } = await this.authService.tokenFromRefresh(refreshToken);
        
        this.setCookies(res, refresh_token, access_token, refresh_expiration);

        res.status(HttpStatus.OK).json({ access_token, user, refresh_expiration });
    }

    private setCookies(res: Response, refreshToken: string, accessToken: string, refreshExpiration: number) {
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            path: '/' + this.config.get('version.prefix') + '/auth/token',
            /*secure: true,
            sameSite: 'strict',*/
            expires: new Date(refreshExpiration)
        });

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            path: '/',
            /*secure: true,
            sameSite: 'strict',*/
            expires: new Date(refreshExpiration)
        });

        res.cookie('logged_in_until', refreshExpiration, {
            httpOnly: false,
            path: '/',
            /*secure: true,
            sameSite: 'strict',*/
            expires: new Date(refreshExpiration)
        });
    }
}
