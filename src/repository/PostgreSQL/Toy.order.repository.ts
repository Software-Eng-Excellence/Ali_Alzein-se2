import { itemCategory } from "../../model/IItem";
import { IdentifiableToy } from "../../model/Toy.model";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import pool from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { SQLiteToy, SQLiteToyMapper } from "../../mappers/Toy.mapper";


const tableName = itemCategory.TOY;
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${tableName}(
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    ageGroup TEXT NOT NULL,
    brand TEXT NOT NULL,
    material TEXT NOT NULL,
    batteryRequired TEXT NOT NULL,
    educational TEXT NOT NULL
)`;
const INSERT_TOY =`INSERT INTO ${tableName}(
id, type, ageGroup, brand, material, batteryRequired, educational)
VALUES($1,$2,$3,$4,$5,$6,$7)`;
const UPDATE_TOY = `UPDATE ${tableName} SET 
type = $2, ageGroup = $3, brand =$4, material =$5, batteryRequired = $6, educational = $7 WHERE id = $1`;
const SELECT_ALL = `SELECT * FROM ${tableName}`;
const SELECT_BY_ID = `SELECT * FROM ${tableName} WHERE id = $1`;
const DELETE_BY_ID = `DELETE FROM ${tableName} WHERE id = $1`;


export class ToyRepository implements IRepository<IdentifiableToy>, Initializable{
    async init(): Promise<void> {
            const client = await pool.connect();
        try {
            client.query(CREATE_TABLE);
            logger.info("Toy initialized");
        } catch (error) {
            logger.error("Failed to initialize Toy table: %0", error as Error);
            throw new InitializationException("Failed to initialize Toy table", error as Error);
        } finally {
            client.release();
        }
    }
    async create(item: IdentifiableToy): Promise<string> {
        let client;
        try {
            client = await pool.connect();
            client.query("BEGIN");
            await client.query(INSERT_TOY,[
                item.getId(),
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.isBatteryRequired(),
                item.isEducational()
            ]);
            client.query("COMMIT");
            logger.info("Order created");
            return item.getId();
        } catch (error) {
            client && client.query("ROLLBACK");
            throw new DbException("Failed to create toy", error as Error);
        }
    }
    async get(id: string): Promise<IdentifiableToy> {
        try {
            const client = await pool.connect();
            const result = await client.query<SQLiteToy>(SELECT_BY_ID, [id]);
            if (!result) {
                throw new ItemNotFoundException(`Cake with id ${id} not found`);
            }
            const toy = result.rows[0]
            return new SQLiteToyMapper().map(toy);
        } catch (error) {
            logger.error("Failed to get Toy of id %s %o", id, error as Error);
            throw new DbException("Failed to get Toy of id" + id, error as Error);
        }
    }
    async getAll(): Promise<IdentifiableToy[]> {
        const client = await pool.connect();
        try {
            const result = await client.query<SQLiteToy>(SELECT_ALL);
            const mapper = new SQLiteToyMapper();
            return result.rows.map((item) => mapper.map(item));
        } catch (error) {
            logger.error("Failed to get Cakes %o", error);
            throw new DbException("Failed to get Cakes", error as Error);
        } finally {
            client.release();
        }
    }
    async update(item: IdentifiableToy): Promise<void> {
            const client = await pool.connect();
        try {
            await client.query(UPDATE_TOY, [
                item.getId(),
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.isBatteryRequired(),
                item.isEducational()
            ]);
        } catch (error) {
            logger.error("Failed to update Toy of id %s %o", item.getId(), error as Error);
            throw new DbException("Failed to update Toy of id" + item.getId(), error as Error);     
        } finally {
            client.release();
        }

    }
    async delete(id: id): Promise<void> {
        try {
            const client = await pool.connect();
            await client.query(DELETE_BY_ID, [id]);
            logger.info("Toy deleted Successfully");
        } catch (error) {
            logger.error("Failed to delete Toys of id %s %o", id, error as Error);
            throw new DbException("Failed to delete Toys of id" + id, error as Error);   
        }
    }
}