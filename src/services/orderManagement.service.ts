import { RepositoryFactory } from "../repository/Repository.factory";
import config from "../config";
import { itemCategory } from "../model/IItem";
import { IIdentifiableOrderItem} from "../model/IOrder"
import { IRepository } from "../repository/IRepository";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class OrderManagementService {
    private async getRepo(category: itemCategory):Promise<IRepository<IIdentifiableOrderItem>>{
        return RepositoryFactory.create(config.dbMode, category);
    }
    private validateOrder(order: IIdentifiableOrderItem):void{
        if (order.getPrice() < 0 || order.getQuantity() <= 0 || !order.getItem()) {
            const details = {
                ItemNotDefined: !order.getItem(),
                NegativePrice: order.getPrice() < 0,
                NegativeQuantity: order.getQuantity() <= 0
            }
            throw new BadRequestException("Invalid order details", details);
        }
    }

    public async createOrder(order: IIdentifiableOrderItem):Promise<IIdentifiableOrderItem> {
        this.validateOrder(order);
        const repo = await this.getRepo(order.getItem().getCategory());
        await repo.create(order)
        return order;
    }

    public async getOrder(id: string):Promise<IIdentifiableOrderItem> {
        const categories = Object.values(itemCategory);
        for (const category of categories) {
            try{
            const repo = await this.getRepo(category);
            const order = await repo.get(id);
            return order;
            }
            catch (error) {
                //ignore
            }
        }
        throw new NotFoundException(`Order with id ${id} not found`);
    }

    public async updateOrder(order: IIdentifiableOrderItem): Promise<void> {
        this.validateOrder(order);
        const repo = await this.getRepo(order.getItem().getCategory());
        await repo.update(order);
    }

    public async deleteOrder(id: string): Promise<void>{
        const categories = Object.values(itemCategory);
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const order = await repo.get(id);
            if (order) {
                await repo.delete(id);
                return;
            }
        }
        throw new NotFoundException(`Order with id ${id} not found`);
    }

    public async getAllOrders(): Promise<IIdentifiableOrderItem[]> {
        const allOrders: IIdentifiableOrderItem[] = [];
        const categories = Object.values(itemCategory);
        for (const category of categories) {
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
            allOrders.push(...orders);
        }
        return allOrders;
    }

    public async getOrdersByCategory(category: itemCategory): Promise<IIdentifiableOrderItem[]> {
        const allOrders: IIdentifiableOrderItem[] = [];
            const repo = await this.getRepo(category);
            const orders = await repo.getAll();
            allOrders.push(...orders);
        return allOrders;
    }

    public async getTotalRevenue(): Promise<number> {
        const allOrders = await this.getAllOrders();
        const revenue = allOrders.map(order => order.getPrice() * order.getQuantity());
        let total=0;
        for (const rev of revenue){
            total += rev;
        }
        return total;
    }
}