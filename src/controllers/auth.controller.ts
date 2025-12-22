import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { AuthenticationService } from "../services/Authentication.service";
import { Request, Response } from "express";
import { UserService } from "../services/UserManagement.service";


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
        res.status(200).json({
            token: this.authService.generateToken(userId)
        });    
        } catch (error) {
            if((error as Error).message === 'User not found'){
                throw new BadRequestException("Invalid credentials");
            }
            throw error;
        }
         
    }

    logout(){
 
    }


}