import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/userManagement.service';
import { asyncHandler } from '../middleware/asyncHandler';

    const service = new UserService();
    const controller = new UserController(service);

    const router = Router();

    router.route('/')
        .post(asyncHandler(controller.createUser.bind(controller)))
        .get(asyncHandler(controller.getAllUsers.bind(controller)));

    router.route('/:id')
        .get(asyncHandler(controller.getUser.bind(controller)))
        .put(asyncHandler(controller.updateUser.bind(controller)))
        .delete(asyncHandler(controller.deleteUser.bind(controller)));

export default router;