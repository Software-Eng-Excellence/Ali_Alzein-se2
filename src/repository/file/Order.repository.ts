import { id, ID, IRepository } from "../IRepository";
import { Order } from "../../model/Order.model";
import { InvalidItemException, ItemNotFoundException } from "../../util/exceptions/RepositoryExceptions";
import logger from "../../util/logger";
import { IOrder } from "../../model/IOrder";

export abstract class OrderRepository  implements IRepository<IOrder>{

    protected abstract load(): Promise<IOrder[]>;

    protected abstract save(orders: IOrder[]): Promise<void>;

    async create(item: IOrder): Promise<id> {
        //validate thr order
        if(!item){
            throw new InvalidItemException("Invalid order");
        }
        //load all orders
        const orders =await this.load();
        //add the new order
        const id =orders.push(item);
        //save all orders
        await this.save(orders);
        logger.info("Order created with id: %s", id);
        return id.toString();
    }

    async get(id: id): Promise<IOrder> {
        const orders= await this.load();
        const foundOrder =  orders.find(order => order.getId() === id);
        if (!foundOrder) {
            logger.error("Failed to find order with id: %s", id);
            throw new ItemNotFoundException("Failed to find element");
        }
        return foundOrder;
    }

    async getAll(): Promise<IOrder[]> {
        return this.load();
    }

    async update(item: Order): Promise<void> {
        if(!item){
            throw new InvalidItemException("Invalid order");
        }
        const orders = await this.load();
        const index = orders.findIndex(o => o.getId() === item.getId());
        if (index === -1){
           logger.error("Failed to find order with id: %s", item.getId());
            throw new ItemNotFoundException("Failed to find element"); 
        }
        orders[index] = item;
        await this.save(orders);
    }

    async delete(id: id): Promise<void> {
        const orders = await this.load();
        const index = orders.findIndex(o => o.getId() === id);
        if (index === -1){
            logger.error("Failed to find order with id: %s", id);
            throw new ItemNotFoundException("Failed to find element"); 
        }
        orders.splice(index, 1);
        await this.save(orders);
    }
}