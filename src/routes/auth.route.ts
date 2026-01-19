import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthenticationController } from '../controllers/auth.controller';
import { AuthenticationService } from '../services/Authentication.service';
import { UserService } from '../services/UserManagement.service';
import { Authenticate } from '../middleware/auth';

    const router = express.Router();

    const authService = new AuthenticationService();
    const userService = new UserService();
    const authController = new AuthenticationController(authService, userService);


    router.route('/login')
        .post(asyncHandler(authController.login.bind(authController)));

    router.route('/logout')
        .get(Authenticate, authController.logout.bind(authController));

export default router;