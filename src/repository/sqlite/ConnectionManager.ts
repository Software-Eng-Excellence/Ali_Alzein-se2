import config from "../../config";
import { Database, Statement } from "sqlite3";
import { open, Database as SqliteDatabase } from "sqlite";
import { DatabaseConnectionException } from "../../util/exceptions/DatabaseConnectionException";
import logger from "../../util/logger";

export class ConnectionManager{
    
    private static db: SqliteDatabase<Database, Statement>| null = null;
    
    private constructor(){}
    
    public static async getConnection(): Promise<SqliteDatabase<Database, Statement>>{
        if(this.db === null){
            try {
                this.db = await open({
                filename: config.storagePath.sqlite,
                driver: Database
            });
            } catch (error: unknown) {
                logger.error("Failed to open database connection: %o", error);
                throw new DatabaseConnectionException("Failed to open database connection", error as Error);
            }
        }
        return this.db;
    }
}       