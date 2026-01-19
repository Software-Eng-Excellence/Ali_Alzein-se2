import { Request, Response } from 'express';
import { UserService } from '../services/UserManagement.service';
import { BadRequestException } from '../util/exceptions/http/BadRequestException';
import { NotFoundException } from '../util/exceptions/http/NotFoundException';
import { ServiceException } from '../util/exceptions/ServiceException';
import { toRole } from '../config/roles';

export class UserController {
    constructor(private userService: UserService) {}

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                throw new BadRequestException('Name, email, and password are required');
            }
            const user = await this.userService.createUser(name, email, password, 'user');
            res.status(201).json({ message: 'User created successfully', data: user });
        } catch (error) {
            throw new ServiceException('Failed to create user');
        }
    }

    async getUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestException('Invalid user ID');
            }
            const user = await this.userService.getUserById(id);
            res.status(200).json({ data: user });
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({ data: users });
        } catch (error) {
            throw new ServiceException('Failed to retrieve users');
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const { name, email, password, role } = req.body;
            if (!id) {
                throw new BadRequestException('Invalid user ID');
            }
            if (!name || !email || !password) {
                throw new BadRequestException('Name, email, and password are required');
            }
            const user = await this.userService.updateUser(id, name, email, password, toRole(role));
            res.status(200).json({ message: 'User updated successfully', data: user });
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestException('Invalid user ID');
            }
            await this.userService.deleteUser(id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }
}
