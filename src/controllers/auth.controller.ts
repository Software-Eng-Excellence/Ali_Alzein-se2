import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { AuthenticationService } from "../services/Authentication.service";
import { Request, Response } from "express";
import { UserService } from "../services/UserManagement.service";
import { AuthRequest } from "config/types";


export class AuthenticationController{
    constructor(
        private authService: AuthenticationService,
        private userService: UserService){}

    async login(req: Request, res: Response) {
        const {email, password} = req.body;
        if(!email || !password){
            throw new BadRequestException("Email and password are required", {
                emailMissing: !email,
                passwordMissing: !password
            });
        }
        try {
        const userId =  await this.userService.validateUser(email, password);
        this.authService.persistAuthentication(res, userId);
        res.status(200).json({
            message: "Login successful",
        });    
        } catch (error) {
            if((error as Error).message === 'User not found'){
                throw new BadRequestException("Invalid credentials");
            }
            throw error;
        }
         
    }

    logout(req: Request, res: Response) {
        const authReq = req as AuthRequest;
        this.authService.clearTokens(res);
        res.status(200).json({
            message: "Logout successful"
        });
    }
}