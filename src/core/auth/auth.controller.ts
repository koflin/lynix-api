import { Controller, Delete, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from 'src/models/user.model';

import { Requestor } from '../users/requestor.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
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

    @UseGuards(JwtAuthGuard)
    @Delete('logout')
    async logout(@Requestor() user, @Req() req: Request, @Res() res: Response) { 
        if (!user) {
            res.status(HttpStatus.NOT_FOUND).send();
            return;
        }

        this.unsetCookies(req, res);

        res.status(HttpStatus.ACCEPTED).send();
    }

    @Post('token')
    async token(@Req() req, @Res() res: Response) {
        const refreshToken = req.cookies['refresh_token'];

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
            path: '/' + this.config.get('version.prefix') + '/auth',
            domain: this.config.get('cookies.domain'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            expires: new Date(refreshExpiration)
        });

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            path: '/',
            domain: this.config.get('cookies.domain'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            expires: new Date(refreshExpiration)
        });
    }

    private unsetCookies(req: Request, res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        const accessToken = req.cookies['access_token'];

        res.clearCookie('refresh_token', {
            httpOnly: true,
            path: '/' + this.config.get('version.prefix') + '/auth',
            domain: this.config.get('cookies.domain'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            expires: new Date(this.authService.getExpirationDate(refreshToken))
        });

        res.clearCookie('access_token', {
            httpOnly: true,
            path: '/',
            domain: this.config.get('cookies.domain'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            expires: new Date(this.authService.getExpirationDate(accessToken))
        });
    }
}
