import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from '../account/account.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
        private accountService: AccountService
    ) {
    }

    /**
     * Verifies account credentials and generates tokens
     * @param email 
     * @param password 
     * @param persist 
     * @param isAdmin 
     * @returns 
     */
    async tokenFromCredentials(email: string, password: string, persist: boolean, isAdmin: boolean) {
        const account = await this.accountService.getByCredentials(email, password, isAdmin);

        if (!account) {
            return null;
        }

        return this.tokenFromAccount(account, isAdmin, persist);
    }

    /**
     * Verifies refresh token and generates new tokens
     * @param refreshToken 
     * @returns 
     */
    async tokenFromRefresh(refreshToken: string) {
        if (!refreshToken || !this.jwtService.verify(refreshToken)) {
            return null;
        }

        const decoded = this.jwtService.decode(refreshToken);
        const id = decoded['sub'];

        if (!id) {
            return null;
        }

        const isAdmin = decoded['isAdmin'];
        const persist = decoded['persist'];

        const account = await this.accountService.getById(id, isAdmin);
        return this.tokenFromAccount(account, isAdmin, persist);
    }

    /**
     * Provides token information
     * @param token 
     * @returns 
     */
    getInfo(token: string) {
        const decoded = this.jwtService.decode(token);
        
        return {
            expiration: decoded['exp'],
            persist: decoded['persist']
        };
    }

    /**
     * Generates tokens from account
     * @param account 
     * @param isAdmin 
     * @param persist 
     * @returns 
     */
    private async tokenFromAccount(account: any, isAdmin: boolean, persist: boolean) {
        if (!account) {
            return null;
        }

        const payloadToken = {
            // Issuer
            iss: this.config.get('jwt.issuer'),
            // Subject
            sub: account.id,
            // Issued at
            iat: new Date().getTime(),

            account: account,
            type: isAdmin ? 'admin' : 'user',
            persist: persist,
        };

        const payloadRefreshToken = {
            // Issuer
            iss: this.config.get('jwt.issuer'),
            // Subject
            sub: account.id,
            // Issued at
            iat: new Date().getTime(),

            type: isAdmin ? 'admin' : 'user',
            persist: persist
        };

        const accessToken = this.jwtService.sign(payloadToken, { expiresIn: this.config.get<number>('jwt.tokenExpiration') * 1000 });
        const refreshToken = this.jwtService.sign(payloadRefreshToken, { expiresIn: this.config.get<number>('jwt.refreshTokenExpiration') * 1000 });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            account: payloadToken.account,
            refresh_expiration : this.jwtService.decode(refreshToken)['exp'],
            access_expiration: this.jwtService.decode(accessToken)['exp'],
            persist: persist
        };
    }
}
