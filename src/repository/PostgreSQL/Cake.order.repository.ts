import { IRepository,Initializable, id } from "../../repository/IRepository";
import { IdentifiableCake } from "../../model/Cake.model";
<<<<<<< HEAD
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
=======
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryExceptions";
>>>>>>> module-4.1
import logger from "../../util/logger";
import { itemCategory } from "../../model/IItem";
import { SQLiteCake, SQLiteCakeMapper } from "../../mappers/Cake.mapper";
import pool from "./ConnectionManager";

const tableName=itemCategory.CAKE;
const CREATE_TABLE=`CREATE TABLE IF NOT EXISTS ${tableName} (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        flavor TEXT NOT NULL,
        filling TEXT NOT NULL,
        size INTEGER NOT NULL,
        layers INTEGER NOT NULL,
        frosting_type TEXT NOT NULL,
        frosting_flavor TEXT NOT NULL,
        decoration_type TEXT NOT NULL,
        decoration_color TEXT NOT NULL,
        custom_message TEXT NOT NULL,
        shape TEXT NOT NULL,
        allergies TEXT NOT NULL,
        special_ingredients TEXT NOT NULL,
        packaging_type TEXT NOT NULL
        )`;

const INSERT_CAKE=`INSERT INTO ${tableName} (
id, type, flavor, filling, size, layers, frosting_type, frosting_flavor,
decoration_type, decoration_color, custom_message, shape, allergies,
special_ingredients, packaging_type) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`;

const SELECT_BY_ID=`SELECT * FROM ${tableName} WHERE id = $1`;
const SELECT_ALL=`SELECT * FROM ${tableName}`;
const DELETE_BY_ID=`DELETE FROM ${tableName} WHERE id = $1`;
const UPDATE_CAKE=`UPDATE ${tableName} SET
 type = $2, flavor = $3, filling = $4, size = $5, layers = $6, frosting_type = $7,
 frosting_flavor = $8, decoration_type = $9, decoration_color = $10, custom_message = $11,
 shape = $12, allergies = $13, special_ingredients = $14, packaging_type = $15 WHERE id = $1`;
 
export class CakeRepository implements IRepository<IdentifiableCake>, Initializable{

    async init(): Promise<void> {
            const client = await pool.connect();
        try {
            await client.query(CREATE_TABLE);
            logger.info("Order initialized");
        } catch (error: unknown) {
            logger.error("Failed to initialize Cake Table: %o", error as Error);
            throw new InitializationException("Failed to initialize Order Table", error as Error);
        } finally {
            client.release();
        }
    }

    async create(item: IdentifiableCake): Promise<id> {
        // it is expected that a transaction has been iniitiated before the method is called.
        let client;
        try {
            client = await pool.connect();
            client.query("BEGIN");
            
            await client.query(INSERT_CAKE, [
                item.getId(),
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType()
            ]);
            client.query("COMMIT");
            logger.info("Order created");
            return item.getId();
        } catch (error) {
            client && client.query("ROLLBACK");
            throw new DbException("Failed to create cake", error as Error);
        }
    }
    async get(id: string): Promise<IdentifiableCake> {
        try {
            const client = await pool.connect();
            const result = await client.query<SQLiteCake>(SELECT_BY_ID, [id]);
            if (!result) {
                throw new ItemNotFoundException(`Cake with id ${id} not found`);
            }
            const cake = result.rows[0]
            return new SQLiteCakeMapper().map(cake);
        } catch (error) {
            logger.error("Failed to get Cake of id %s %o", id, error as Error);
            throw new DbException("Failed to get Cake of id" + id, error as Error);
        }
    }
    async getAll(): Promise<IdentifiableCake[]> {
        const client = await pool.connect();
        try {
            const result = await client.query<SQLiteCake>(SELECT_ALL);

            const mapper = new SQLiteCakeMapper();
            return result.rows.map((item) => mapper.map(item));
        } catch (error) {
            logger.error("Failed to get Cakes %o", error);
            throw new DbException("Failed to get Cakes", error as Error);
        } finally {
            client.release();
        }
    }
    async update(item: IdentifiableCake): Promise<void> {
            const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query(UPDATE_CAKE, [
                item.getId(),
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType()
            ]);
            await client.query("COMMIT");
        } catch (error) {
            logger.error("Failed to update Cake of id %s %o", item.getId(), error as Error);
            throw new DbException("Failed to update Cake of id" + item.getId(), error as Error);
        } finally {
            client.release();
        }
    }
    
    async delete(id: id): Promise<void> {
        try {
            const client = await pool.connect();
            await client.query(DELETE_BY_ID, [id]);
        } catch (error) {
            logger.error("Failed to delete Cake of id %s %o", id, error as Error);
            throw new DbException("Failed to delete Cake of id" + id, error as Error);
        }
    }

}