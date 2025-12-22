import config from '../config';
import { TokenPayload } from '../config/types';
import jwt from 'jsonwebtoken';
import { AuthenticationException, InvalidTokenException, TokenExpiredException } from '../util/exceptions/http/AuthenticationException';
import logger from '../util/logger';


export class AuthenticationService {
    constructor(
        private jwtSecret = config.auth.jwtSecret,
        private expirationTime = config.auth.tokenExpiration
    ){}

    generateToken(userId: string): string {
        return jwt.sign(
            {userId},
            this.jwtSecret,
            { expiresIn: this.expirationTime }
        );
    }

    verify(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.jwtSecret) as TokenPayload;
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

}    