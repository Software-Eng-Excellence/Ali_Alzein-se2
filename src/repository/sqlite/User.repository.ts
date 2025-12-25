import logger from '../../util/logger';
import { toRole } from '../../config/roles';
import { User } from '../../model/User.model';
import { InitializableRepository, id } from '../IRepository';
import { ConnectionManager } from './ConnectionManager';

export class UserRepository implements InitializableRepository<User> {
    async init(): Promise<void> {
        const db = await ConnectionManager.getConnection();
        await db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )`
        );
        const tableInfo = await db.all(`PRAGMA table_info(users)`);
        const roleColumnExists = tableInfo.some(column => column.name === `role`);
        if(!roleColumnExists){
            try{
                await db.exec(`
                    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
                `);
                logger.info("Role Table Added Successfully");
            }
            catch(error){
                console.log("Failed to add role column"+ error);
                throw error;
            }
        }
    }

    async create(item: User): Promise<id> {
        const db = await ConnectionManager.getConnection();
        await db.run(
            'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            item.id,
            item.name,
            item.email,
            item.password,
            item.role
        );
        return item.id;
    }

    async get(id: id): Promise<User> {
        const db = await ConnectionManager.getConnection();
        const row = await db.get('SELECT * FROM users WHERE id = ?', id);
        if (!row) throw new Error('ItemNotFound');
        return new User(row.name, row.email, row.password, toRole(row.role), String(row.id));
    }

    async getAll(): Promise<User[]> {
        const db = await ConnectionManager.getConnection();
        const rows = await db.all('SELECT * FROM users');
        return rows.map((row: any) => new User(row.name, row.email, row.password, toRole(row.role), String(row.id)));
    }

    async update(item: User): Promise<void> {
        const db = await ConnectionManager.getConnection();
        const res = await db.run(
            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
            item.name,
            item.email,
            item.password,
            item.role,
            item.getId()
        );
        if ((res as any).changes === 0) throw new Error('ItemNotFound');
    }

    async delete(id: id): Promise<void> {
        const db = await ConnectionManager.getConnection();
        const res = await db.run('DELETE FROM users WHERE id = ?', id);
        if ((res as any).changes === 0) throw new Error('ItemNotFound');
    }

    async getByEmail(email: string): Promise<User> {
        const db = await ConnectionManager.getConnection();
        const user = await db.get('SELECT * FROM users WHERE email = ?', email);
        if (!user) throw new Error('ItemNotFound');
        return new User(
            user.name,
            user.email,
            user.password,
            toRole(user.role),
            user.id
        );
    }
}

export async function createUserRepository(): Promise<UserRepository> {
    const repo = new UserRepository();
    await repo.init();
    return repo;
}