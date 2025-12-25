import { PERMISSION, ROLE, rolePermissions } from "../config/roles";
import { AuthRequest } from "config/types";
import { NextFunction, Request, Response } from "express";
import { AuthenticationFailedException } from "../util/exceptions/http/AuthenticationException";
import { InsufficientPermissionException, InvalidRoleException } from "../util/exceptions/http/AuthorizationException";
import logger from "../util/logger";


export function hasPermission(permission: PERMISSION) {
    return(req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        if(!authReq.user){
            throw new AuthenticationFailedException();
        }
        const role = authReq.user.role;

        if(!rolePermissions[role]){
            logger.error(`Invalid Role`);
            throw new InvalidRoleException(role);
        }
        if(!rolePermissions[role].includes(permission)){
            logger.error(`User with role ${role} doesnt have permission ${permission}`);
            throw new InsufficientPermissionException();
        }
        next();
    }
}

export function hasRole(allowedRoles: ROLE[]){
    return(req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        if(!authReq){
            throw new AuthenticationFailedException();
        }
        const userRole = authReq.user.role;
        if(!allowedRoles.includes(userRole)){
            logger.error(`User with role ${userRole} doesnt have access`);
            throw new InsufficientPermissionException();
        }
        next();
    }
}