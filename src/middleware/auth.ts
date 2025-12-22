import { AuthRequest } from "../config/types";
import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../services/Authentication.service";
import { AuthenticationFailedException } from "../util/exceptions/http/AuthenticationException";

const authService = new AuthenticationService();

export function Authenticate(req: Request, res: Response, next: NextFunction) {

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        throw new AuthenticationFailedException();
    }
    const payload = authService.verify(token);

    (req as AuthRequest).userId = payload.userId;
    next();
}