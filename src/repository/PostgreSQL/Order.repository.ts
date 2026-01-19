import { IIdentifiableOrderItem } from "../../model/IOrder";
import { id, Initializable, IRepository } from "../../repository/IRepository";
import logger from "../../util/logger";
<<<<<<< HEAD
import { DbException, InitializationException } from "../../util/exceptions/repositoryExceptions";
=======
import { DbException, InitializationException } from "../../util/exceptions/RepositoryExceptions";
>>>>>>> module-4.1
import { IIdentifiableItem } from "../../model/IItem";
import {SQLiteOrder, SQLiteOrderMapper}  from "../../mappers/Order.mapper";
import pool from "../PostgreSQL/ConnectionManager";

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS "order" (
    id TEXT PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    item_category TEXT NOT NULL,
    item_id TEXT NOT NULL
  )`;

const INSERT_ORDER = `
  INSERT INTO "order" (id, quantity, price, item_category, item_id)
  VALUES ($1, $2, $3, $4, $5)
`;

const SELECT_ORDER_BY_ID = `
  SELECT * FROM "order" WHERE id = $1
`;

const SELECT_ALL_ORDERS = `
  SELECT * FROM "order" WHERE item_category = $1
`;

const DELETE_ORDER_BY_ID = `
  DELETE FROM "order" WHERE id = $1
`;

const UPDATE_ORDER = `
  UPDATE "order"
  SET quantity = $2, price = $3, item_category = $4, item_id = $5
  WHERE id = $1
`;


export class OrderRepository implements IRepository<IIdentifiableOrderItem>, Initializable{
    constructor(private readonly itemRepository: IRepository<IIdentifiableItem> & Initializable){}

    async init(){
            const client = await pool.connect();
        try {
            await client.query(CREATE_TABLE);
            await this.itemRepository.init();
            logger.info("Order initialized");
        } catch (error: unknown) {
            throw new InitializationException("Failed to initialize Order Table", error as Error);
        } finally {
            client.release();
        }

    }

    async create(order: IIdentifiableOrderItem): Promise<id> {
        let client;
        try {
            client = await pool.connect();
            await client.query("BEGIN");
            const item_id = await this.itemRepository.create(order.getItem());
            await client.query(INSERT_ORDER, [
            order.getId(),
            order.getQuantity(),
            order.getPrice(),
            order.getItem().getCategory(),
            item_id
            ]);
            await client.query("COMMIT");
            return order.getId();
        } catch (error: unknown) {
            logger.error("Failed to create order: %o", error);
            client && client.query("ROLLBACK");
            throw new DbException("Failed to create order", error as Error);
        }
    }

    async get(id: id): Promise<IIdentifiableOrderItem> {
            const client = await pool.connect();
        try {
            const result = await client.query<SQLiteOrder>(SELECT_ORDER_BY_ID, [id]);
            if (!result) {
                logger.error("Order with id %s not found", id);
                throw new Error(`Order with id ${id} not found`);
            }
            const order = result.rows[0];
            const item = await this.itemRepository.get(order.item_id);
            return new SQLiteOrderMapper().map({ data: order, item });
        } catch (error) {
            logger.error("Failed to get order of id %s %o", id, error as Error);
            throw new DbException("Failed to get order of id" + id, error as Error);
        }
    }

    async getAll(): Promise<IIdentifiableOrderItem[]> {
        const client = await pool.connect();
        try {
            const items = await this.itemRepository.getAll();
            if (items.length === 0) {
            return [];
            }

            const result = await client.query<SQLiteOrder>(SELECT_ALL_ORDERS, [
            items[0].getCategory(),
            ]);

            const orders = result.rows;

            const bindedOrders = orders.map(order => {
            const item = items.find(i => i.getId() === order.item_id);
            if (!item) {
                throw new DbException(
                `Item with id ${order.item_id} not found for order ${order.id}`,
                new Error("Item not found")
                );
            }
            return { order, item };
            });

            const mapper = new SQLiteOrderMapper();
            return bindedOrders.map(({ order, item }) =>
            mapper.map({ data: order, item })
            );
        } catch (error) {
            logger.error("Failed to get orders %o", error);
            throw new DbException("Failed to get orders", error as Error);
        }
    }

    async update(order: IIdentifiableOrderItem): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await this.itemRepository.update(order.getItem());
            await client.query(UPDATE_ORDER, [
            order.getId(),
            order.getQuantity(),
            order.getPrice(),
            order.getItem().getCategory(),
            order.getItem().getId()
            ]);
            await client.query("COMMIT");
        } catch (error: unknown) {
            logger.error("Failed to update order of id:%s %o", order.getId(), error as Error);
            await client.query("ROLLBACK");
            throw new DbException("Failed to update order" + order.getId(), error as Error);
        } finally {
            client.release();
        }
    }


    async delete(id: id): Promise<void> {
        let client;
        try {
            client = await pool.connect();
            client.query("BEGIN");
<<<<<<< HEAD
            await this.itemRepository.delete(id);
=======
            const itemId = (await this.get(id)).getItem().getId();
            await this.itemRepository.delete(itemId);
>>>>>>> module-4.1
            await client.query(DELETE_ORDER_BY_ID, [id]);
            await client.query("COMMIT");
        } catch (error: unknown) {
            logger.error("Failed to delete order: %o", error);
            client && client.query("ROLLBACK");
            throw new DbException("Failed to delete order", error as Error);
        }
    }
}