import { Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/models/user.model';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {

    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: { user: User }, @Res() res) {
        const { access_token, refresh_token, user, refresh_expiration } = await this.authService.token(req.user);

        /*res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000000
        });*/

        return { access_token, user, refresh_expiration };
    }

    @Post('token')
    async token(@Req() req, @Res() res) {
        const refreshToken = req.cookies['refresh_token'];

        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token provided!');
        }

        const response = await this.authService.refresh(refreshToken);

        if (!response) {
            throw new UnauthorizedException('Invalid refresh token!');
        }

        const { access_token, refresh_token, user, refresh_expiration } = await this.authService.token(req.user);
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            /*secure: true,*/
            /*sameSite: 'strict',*/
            maxAge: 1000000
        });

        return { access_token, user, refresh_expiration  };
    }
}
