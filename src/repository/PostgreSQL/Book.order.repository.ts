import { itemCategory } from "../../model/IItem";
import { IdentifiableBook } from "../../model/Book.model";
import { id, Initializable, IRepository } from "../IRepository";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { SQLiteBook, SQLiteBookMapper } from "../../mappers/book.mapper";
import pool from "./ConnectionManager";

const tableName=itemCategory.BOOK;
const CREATE_TABLE=`CREATE TABLE IF NOT EXISTS ${tableName}(
    id TEXT PRIMARY KEY,
    bookTitle TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    format TEXT NOT NULL,
    language TEXT NOT NULL,
    publisher TEXT NOT NULL,
    specialEdition TEXT NOT NULL,
    packaging TEXT NOT NULL
)`;
const INSERT_BOOK=`INSERT INTO ${tableName}(
    id, bookTitle, author, genre, format, language, publisher, specialEdition, packaging)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
const UPDATE_BOOK = `UPDATE ${tableName} SET 
    bookTitle = $2, author = $3, genre = $4, format = $5, language = $6, publisher = $7, specialEdition = $8, packaging = $9 WHERE id =$1`;
const SELECT_BY_ID = ` SELECT * FROM ${tableName} WHERE id=$1`;    const SELECT_ALL =` SELECT * FROM ${tableName}`;
const DELETE_BY_ID=`DELETE FROM ${tableName} WHERE id = $1`;

export class BookRepository implements IRepository<IdentifiableBook>,Initializable{
    async init(): Promise<void> {
            const client = await pool.connect();
        try {
            await client.query(CREATE_TABLE);
            logger.info("Book initialized");
        } catch (error) {
            logger.error("Failed to initialize Book table: %o", error as Error);
            throw new InitializationException("Failed to initialize Book table", error as Error);
        } finally {
            client.release();
        }
    }
    async getAll(): Promise<IdentifiableBook[]> {
        const client = await pool.connect();
        try {
            const result = await client.query<SQLiteBook>(SELECT_ALL);

            const mapper = new SQLiteBookMapper();
            return result.rows.map((item) => mapper.map(item));
        } catch (error) {
            logger.error("Failed to get Books %o", error);
            throw new DbException("Failed to get Books", error as Error);
        } finally {
            client.release();
        }
    }    
    async create(item: IdentifiableBook): Promise<string> {
        let client;
        try {
            client = await pool.connect();
            await client.query(INSERT_BOOK, [
                item.getId(),
                item.getBookTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging()
            ]);
            logger.info("Book Created");
            return item.getId();
        } catch (error) {
            client && client.query("ROLLBACK");
            throw new DbException("Failed to create book", error as Error);
        }
    }
    async get(id: string): Promise<IdentifiableBook> {
        try {
            const client = await pool.connect();
            const result = await client.query<SQLiteBook>(SELECT_BY_ID, [id]);
            if (!result) {
                throw new ItemNotFoundException(`Cake with id ${id} not found`);
            }
            const book = result.rows[0]
            return new SQLiteBookMapper().map(book);
        } catch (error) {
            logger.error("Failed to get Book of id %s %o", id, error as Error);
            throw new DbException("Failed to get Book of id" + id, error as Error);
        }
    }
    async update(item: IdentifiableBook): Promise<void> {
            const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query(UPDATE_BOOK, [
                item.getId(),
                item.getBookTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging()
            ]);
            await client.query("COMMIT");
        } catch (error) {
            logger.error("Failed to update Book of id %s %o", item.getId(), error as Error);
            await client.query("ROLLBACK");
            throw new DbException("Failed to update Book of id" + item.getId(), error as Error);            
        }finally {
            client.release();
        }
    }
    async delete(id: id): Promise<void> {
        try {
            const client = await pool.connect();
            await client.query(DELETE_BY_ID, [id]);
        } catch (error) {
            logger.error("Failed to delete Books of id %s %o", id, error as Error);
            throw new DbException("Failed to delete Books of id" + id, error as Error);
        }
    }
}