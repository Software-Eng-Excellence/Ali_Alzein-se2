import {JwtPayload} from 'jsonwebtoken';
import {Request} from 'express';

export enum DBMode {
    SQLITE,
    POSTGRESQL,
    FILE
}

export interface TokenPayload extends JwtPayload {
    userId: string;
}

export interface AuthRequest extends Request {
    userId: string;
}