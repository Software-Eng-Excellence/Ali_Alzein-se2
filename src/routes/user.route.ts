import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/UserManagement.service';
import { asyncHandler } from '../middleware/asyncHandler';
import { Authenticate } from '../middleware/auth';

    const service = new UserService();
    const controller = new UserController(service);

    const router = Router();

    router.route('/')
        .post(asyncHandler(controller.createUser.bind(controller)))
        .get(Authenticate, asyncHandler(controller.getAllUsers.bind(controller)));

    router.route('/:id')
        .get(Authenticate,asyncHandler(controller.getUser.bind(controller)))
        .put(Authenticate,asyncHandler(controller.updateUser.bind(controller)))
        .delete(Authenticate,asyncHandler(controller.deleteUser.bind(controller)));

export default router;