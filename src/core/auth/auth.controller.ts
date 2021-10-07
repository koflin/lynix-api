import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { Account } from './account.decorator';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private config: ConfigService
    ) {

    }

    @Post('login')
    async login(@Res() res: Response, @Body() body) {
        const { email, password, persist, isAdmin } = body;

        if (!email || !password) {
            throw new BadRequestException('Credentials missing!');
        }

        const auth = await this.authService.tokenFromCredentials(email, password, persist, isAdmin);

        if (!auth) {
            throw new UnauthorizedException('Credentials wrong!');
        }

        const { access_token, refresh_token, account, refresh_expiration } = auth;
        
        this.setCookies(res, refresh_token, access_token);

        res.status(HttpStatus.OK).json({ access_token, account, refresh_expiration });
    }

    @UseGuards(AuthGuard)
    @Delete('logout')
    async logout(@Account() account, @Req() req: Request, @Res() res: Response) { 
        if (!account) {
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

        const auth = await this.authService.tokenFromRefresh(refreshToken);

        if (!auth) {
            throw new UnauthorizedException('Invalid refresh token!');
        }

        const { access_token, refresh_token, account, refresh_expiration, persist } = auth;
        
        this.setCookies(res, refresh_token, access_token);

        res.status(HttpStatus.OK).json({ access_token, account, refresh_expiration, persist });
    }

    private setCookies(res: Response, refreshToken: string, accessToken: string) {
        const refreshInfo = this.authService.getInfo(refreshToken);
        const accessInfo = this.authService.getInfo(accessToken);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            path: '/' + this.config.get('version.prefix') + '/auth',
            domain: this.config.get('cookies.domain'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            expires: refreshInfo.persist ? new Date(refreshInfo.expiration) : undefined
        });

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            path: '/',
            domain: this.config.get('cookies.domain'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            expires: accessInfo.persist ? new Date(accessInfo.expiration) : undefined
        });
    }

    private unsetCookies(req: Request, res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        const accessToken = req.cookies['access_token'];
        const refreshInfo = this.authService.getInfo(refreshToken);
        const accessInfo = this.authService.getInfo(accessToken);

        res.clearCookie('refresh_token', {
            httpOnly: true,
            path: '/' + this.config.get('version.prefix') + '/auth',
            domain: this.config.get('cookies.domain'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            expires: refreshInfo.persist ? new Date(refreshInfo.expiration) : undefined
        });

        res.clearCookie('access_token', {
            httpOnly: true,
            path: '/',
            domain: this.config.get('cookies.domain'),
            secure: this.config.get('cookies.secure'),
            sameSite: this.config.get('cookies.sameSite'),
            expires: accessInfo.persist ? new Date(accessInfo.expiration) : undefined
        });
    }
}
