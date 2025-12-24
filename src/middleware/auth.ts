import { AuthRequest } from "../config/types";
import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../services/Authentication.service";
import { AuthenticationFailedException } from "../util/exceptions/http/AuthenticationException";
import { ref } from "process";

const authService = new AuthenticationService();

export function Authenticate(req: Request, res: Response, next: NextFunction) {

    let token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    
    if (!token) {
        if(!refreshToken){
            throw new AuthenticationFailedException();
        }
        const newToken = authService.refreshToken(refreshToken);
        authService.setTokenIntoCookie(res, newToken);
        token = newToken;
    }
    const payload = authService.verify(token);

    (req as AuthRequest).userId = payload.userId;
    next();
}