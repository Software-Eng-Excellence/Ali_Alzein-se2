import { HttpException } from "./HException";

export class AuthorizationException extends HttpException {
    constructor(message: string) {
        super(message, 403);
        this.name = "AuthorizationException";
    }
}

export class InvalidRoleException extends AuthorizationException{
    constructor(role: string){
        super("Invalid Role: " + role);
        this.name = "InvalidRoleException";
    }
}

export class InsufficientPermissionException extends AuthorizationException{
    constructor(){
        super("Insufficient Permission");
        this.name = "InsufficientPermissionException";
    }
}