import {JwtPayload} from 'jsonwebtoken';
import {Request} from 'express';
import { ROLE } from './roles';

export enum DBMode {
    SQLITE,
    POSTGRESQL,
    FILE
}

export interface UserPayload{
    userId: string;
    role: ROLE;
}

export interface TokenPayload extends JwtPayload {
    user: UserPayload;
}

export interface AuthRequest extends Request {
    user: UserPayload;
}