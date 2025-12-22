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
    }

    async create(item: User): Promise<id> {
        const db = await ConnectionManager.getConnection();
        await db.run(
            'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
            item.id,
            item.name,
            item.email,
            item.password
        );
        return item.id;
    }

    async get(id: id): Promise<User> {
        const db = await ConnectionManager.getConnection();
        const row = await db.get('SELECT * FROM users WHERE id = ?', id);
        if (!row) throw new Error('ItemNotFound');
        return new User(row.name, row.email, row.password, String(row.id));
    }

    async getAll(): Promise<User[]> {
        const db = await ConnectionManager.getConnection();
        const rows = await db.all('SELECT * FROM users');
        return rows.map((row: any) => new User(row.name, row.email, row.password, String(row.id)));
    }

    async update(item: User): Promise<void> {
        const db = await ConnectionManager.getConnection();
        const res = await db.run(
            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
            item.name,
            item.email,
            item.password,
            item.getId()
        );
        if ((res as any).changes === 0) throw new Error('ItemNotFound');
    }

    async delete(id: id): Promise<void> {
        const db = await ConnectionManager.getConnection();
        const res = await db.run('DELETE FROM users WHERE id = ?', id);
        if ((res as any).changes === 0) throw new Error('ItemNotFound');
    }
}

export async function createUserRepository(): Promise<UserRepository> {
    const repo = new UserRepository();
    await repo.init();
    return repo;
}