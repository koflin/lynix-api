import { Controller, UseGuards, Post, Request, Body } from '@nestjs/common';
import { ApiTags, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from 'src/models/user.model';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginCredentials } from 'src/dto/auth/loginCredentials';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {

    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: { user: User }, @Body() loginCredentials: LoginCredentials) {
        return this.authService.login(req.user);
    }
}
