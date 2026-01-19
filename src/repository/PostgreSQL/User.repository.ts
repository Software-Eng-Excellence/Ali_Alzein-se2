import { User } from "../../model/User.model";
import { id, InitializableRepository } from "../IRepository";
import logger from "../../util/logger";
import {
  DbException,
  InitializationException,
  ItemNotFoundException,
} from "../../util/exceptions/RepositoryExceptions";
import pool from "./ConnectionManager";

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`;

const INSERT_USER = `
  INSERT INTO users (id, name, email, password)
  VALUES ($1, $2, $3, $4)
`;

const SELECT_USER_BY_ID = `SELECT * FROM users WHERE id = $1`;
const SELECT_ALL_USERS = `SELECT * FROM users`;
const DELETE_USER_BY_ID = `DELETE FROM users WHERE id = $1`;
const UPDATE_USER = `
  UPDATE users
  SET name = $2, email = $3, password = $4
  WHERE id = $1
`;
const SELECT_USER_BY_EMAIL = `SELECT * FROM users WHERE email = $1`;

export class UserRepository implements InitializableRepository<User> {
  async init(): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(CREATE_TABLE);
      logger.info("User table initialized");
    } catch (error: unknown) {
      throw new InitializationException("Failed to initialize User table", error as Error);
    } finally {
      client.release();
    }
  }

  async create(item: User): Promise<id> {
    const client = await pool.connect();
    try {
      await client.query(INSERT_USER, [item.id, item.name, item.email, item.password]);
      return item.id;
    } catch (error: unknown) {
      logger.error("Failed to create user: %o", error);
      throw new DbException("Failed to create user", error as Error);
    } finally {
      client.release();
    }
  }

  async get(id: id): Promise<User> {
    const client = await pool.connect();
    try {
      const res = await client.query(SELECT_USER_BY_ID, [id]);
      if (!res || res.rows.length === 0) {
        throw new ItemNotFoundException(`User with id ${id} not found`);
      }
      const row = res.rows[0];
      return new User(row.name, row.email, row.password, String(row.id));
    } catch (error: unknown) {
      if (error instanceof ItemNotFoundException) throw error;
      logger.error("Failed to get user of id %s %o", id, error as Error);
      throw new DbException("Failed to get user of id" + id, error as Error);
    } finally {
      client.release();
    }
  }

  async getAll(): Promise<User[]> {
    const client = await pool.connect();
    try {
      const res = await client.query(SELECT_ALL_USERS);
      const rows = res.rows ?? [];
      return rows.map((row: any) => new User(row.name, row.email, row.password, String(row.id)));
    } catch (error: unknown) {
      logger.error("Failed to get all users: %o", error);
      throw new DbException("Failed to get all users", error as Error);
    } finally {
      client.release();
    }
  }

  async update(item: User): Promise<void> {
    const client = await pool.connect();
    try {
      const res = await client.query(UPDATE_USER, [item.getId(), item.name, item.email, item.password]);
      if (res.rowCount === 0) throw new ItemNotFoundException(`User with id ${item.getId()} not found`);
    } catch (error: unknown) {
      if (error instanceof ItemNotFoundException) throw error;
      logger.error("Failed to update user of id:%s %o", item.getId(), error as Error);
      throw new DbException("Failed to update user" + item.getId(), error as Error);
    } finally {
      client.release();
    }
  }

  async delete(id: id): Promise<void> {
    const client = await pool.connect();
    try {
      const res = await client.query(DELETE_USER_BY_ID, [id]);
      if (res.rowCount === 0) throw new ItemNotFoundException(`User with id ${id} not found`);
    } catch (error: unknown) {
      if (error instanceof ItemNotFoundException) throw error;
      logger.error("Failed to delete user: %o", error);
      throw new DbException("Failed to delete user", error as Error);
    } finally {
      client.release();
    }
  }

  async getByEmail(email: string): Promise<User> {
    const client = await pool.connect();
    try {
      const res = await client.query(SELECT_USER_BY_EMAIL, [email]);
      if (!res || res.rows.length === 0) throw new ItemNotFoundException(`User with email ${email} not found`);
      const row = res.rows[0];
      return new User(row.name, row.email, row.password, String(row.id));
    } catch (error: unknown) {
      if (error instanceof ItemNotFoundException) throw error;
      logger.error("Failed to get user by email %s %o", email, error as Error);
      throw new DbException("Failed to get user by email " + email, error as Error);
    } finally {
      client.release();
    }
  }
}

export async function createUserRepository(): Promise<UserRepository> {
  const repo = new UserRepository();
  await repo.init();
  return repo;
}
