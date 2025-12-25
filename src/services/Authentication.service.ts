import config from '../config';
import { TokenPayload, UserPayload } from '../config/types';
import jwt from 'jsonwebtoken';
import { AuthenticationException, InvalidTokenException, TokenExpiredException } from '../util/exceptions/http/AuthenticationException';
import logger from '../util/logger';
import { Response } from 'express';
import ms from 'ms';


export class AuthenticationService {
    constructor(
        private jwtSecret = config.auth.jwtSecret,
        private expirationTime = config.auth.tokenExpiration,
        private refreshTokenExpiration = config.auth.refreshTokenExpiration
    ){}

    generateToken(payload: UserPayload): string {
        return jwt.sign(
            payload,
            this.jwtSecret,
            { expiresIn: this.expirationTime }
        );
    }

    generateRefreshToken(payload: UserPayload): string {
        return jwt.sign(
            payload,
            this.jwtSecret,
            { expiresIn: this.refreshTokenExpiration }
        );
    }

    verify(token: string): UserPayload {
        try {
            return jwt.verify(token, this.jwtSecret) as UserPayload;
        } catch (error) {
            logger.error("Token verification failed", error);
            if(error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredException();
            }
            if(error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenException();
            }
            throw new AuthenticationException("Failed to verify token");
        }
    }

    refreshToken(refreshToken: string): string {
        const payload = this.verify(refreshToken);
        if (!payload.userId) {
            throw new InvalidTokenException();
        }
        return this.generateToken(payload);
    }

    setTokenIntoCookie(res: Response, token: string) {
        res.cookie('token', token, {
            httpOnly: true,
            secure: config.isProduction,
            maxAge: ms(this.expirationTime)
        });
    }

    setRefreshTokenIntoCookie(res: Response, refreshToken: string) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.isProduction,
            maxAge: ms(this.refreshTokenExpiration)
        });
    }

    clearTokens(res: Response) {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
    }

    persistAuthentication(res: Response, payload: UserPayload) {
        const refreshToken = this.generateRefreshToken(payload);
        const token = this.generateToken(payload);
        this.setTokenIntoCookie(res, token);
        this.setRefreshTokenIntoCookie(res, refreshToken);
    }
}    