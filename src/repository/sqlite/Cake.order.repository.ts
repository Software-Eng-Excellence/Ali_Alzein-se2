import { IRepository,Initializable, id } from "../../repository/IRepository";
import { IdentifiableCake } from "../../model/Cake.model";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/RepositoryExceptions";
import logger from "../../util/logger";
import { ConnectionManager } from "../sqlite/ConnectionManager";
import { itemCategory } from "../../model/IItem";
import { SQLiteCake, SQLiteCakeMapper } from "../../mappers/Cake.mapper";

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
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

const SELECT_BY_ID=`SELECT * FROM ${tableName} WHERE id = ?`;
const SELECT_ALL=`SELECT * FROM ${tableName}`;
const DELETE_BY_ID=`DELETE FROM ${tableName} WHERE id = ?`;
const UPDATE_CAKE=`UPDATE ${tableName} SET
 type = ?, flavor = ?, filling = ?, size = ?, layers = ?, frosting_type = ?,
 frosting_flavor = ?, decoration_type = ?, decoration_color = ?, custom_message = ?,
 shape = ?, allergies = ?, special_ingredients = ?, packaging_type = ? WHERE id = ?`;
 
export class CakeRepository implements IRepository<IdentifiableCake>, Initializable{

    async init(): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger.info("Order initialized");
        } catch (error: unknown) {
            logger.error("Failed to initialize Cake Table: %o", error as Error);
            throw new InitializationException("Failed to initialize Order Table", error as Error);
        }
    }

    async create(item: IdentifiableCake): Promise<id> {
        // it is expected that a transaction has been iniitiated before the method is called.
        let conn;
        try {
            conn = await ConnectionManager.getConnection();
            //conn.exec("BEGIN TRANSACTION");
            
            await conn.run(INSERT_CAKE, [
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
            //conn.exec("COMMIT");
            logger.info("Order created");
            return item.getId();
        } catch (error) {
            conn && conn.exec("ROLLBACK");
            throw new DbException("Failed to create cake", error as Error);
        }
    }
    async get(id: string): Promise<IdentifiableCake> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.get<SQLiteCake>(SELECT_BY_ID, id);
            if (!result) {
                throw new ItemNotFoundException(`Cake with id ${id} not found`);
            }
            return new SQLiteCakeMapper().map(result);
        } catch (error) {
            logger.error("Failed to get Cake of id %s %o", id, error as Error);
            throw new DbException("Failed to get Cake of id" + id, error as Error);
        }
    }
    async getAll(): Promise<IdentifiableCake[]> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.all<SQLiteCake[]>(SELECT_ALL);
            const mapper = new SQLiteCakeMapper();
            return result.map((item) => mapper.map(item));
        } catch (error) {
            logger.error("Failed to get Cakes %o");
            throw new DbException("Failed to get Cakes of id" , error as Error);
        }
    }
    async update(item: IdentifiableCake): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(UPDATE_CAKE, [
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
            ])
        } catch (error) {
            logger.error("Failed to update Cake of id %s %o", item.getId(), error as Error);
            throw new DbException("Failed to update Cake of id" + item.getId(), error as Error);
        }
    }
    
    async delete(id: id): Promise<void> {
        try {
            const conn = await ConnectionManager.getConnection();
            await conn.run(DELETE_BY_ID, id);
        } catch (error) {
            logger.error("Failed to delete Cake of id %s %o", id, error as Error);
            throw new DbException("Failed to delete Cake of id" + id, error as Error);
        }
    }

}