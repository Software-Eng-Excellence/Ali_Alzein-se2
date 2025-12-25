import { createUserRepository, UserRepository } from '../repository/sqlite/User.repository';
import { User } from '../model/User.model';
import { id } from '../repository/IRepository';
import { generateUUID } from '../util';
import { NotFoundException } from '../util/exceptions/http/NotFoundException';
import { toRole } from '../config/roles';

export class UserService {
	private userRepository?: UserRepository;

    async createUser(name: string, email: string, password: string, role: string): Promise<User> {
        if (!name || !email || !password) throw new Error('Name, email, and password are required');
        const user = new User(name, email, password, toRole(role));
        user.id = generateUUID('user');
        (await this.getRepository()).create(user);
        return user;
    }

	async getUserById(id: id): Promise<User> {
		if (!id || id === '') throw new Error('Invalid user ID');
		return (await this.getRepository()).get(id);
	}

	async getAllUsers(): Promise<User[]> {
		return (await this.getRepository()).getAll();
	}

	async updateUser(id: id, name: string, email: string, password: string, role: string): Promise<User> {
		if (!id || id === '') throw new Error('Invalid user ID');
		if (!name || !email || !password) throw new Error('Name, email, and password are required');
		const user = new User(name, email, password, toRole(role), id);
		await (await this.getRepository()).update(user);
		return (await this.getRepository()).get(id);
	}

	async deleteUser(id: id): Promise<void> {
		if (!id || id === '') throw new Error('Invalid user ID');
		await (await this.getRepository()).delete(id);
	}

	async validateUser(email: string, password: string): Promise<User> {
		const user: User = await (await this.getRepository()).getByEmail(email);
		if(!user) {
			throw new NotFoundException('User not found');
		}
		if (user.password !== password) {
			throw new NotFoundException('Invalid credentials');
		}
		return user;
	}

    private async getRepository():Promise<UserRepository> {
        if (!this.userRepository) {
            this.userRepository = await createUserRepository();
        }
        return this.userRepository;
        }
}
