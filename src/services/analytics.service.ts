import { itemCategory } from "../model/IItem";
import { IIdentifiableOrderItem } from "../model/IOrder";
import { OrderManagementService } from "./OrderManagement.service";


export class AnalyticsService {
    orderManagementService: OrderManagementService;

    constructor(orderManagementService: OrderManagementService) {
        this.orderManagementService = orderManagementService;
    }

    public async getOrderCount(): Promise<number> {
        const allOrders: IIdentifiableOrderItem[] = await this.orderManagementService.getAllOrders();
        return allOrders.length;
    }

    public async getOrderCountByCategory(): Promise<Map<string, number>> {
        const allOrders: IIdentifiableOrderItem[] = await this.orderManagementService.getAllOrders();
        const categoryMap = new Map<string, number>();
        for (const order of allOrders) {
            const category = order.getItem().getCategory();
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        }
        return categoryMap;
    }

    public async getOrderCountByCategory2(category: itemCategory): Promise<number> {
        const allOrders: IIdentifiableOrderItem[] = await this.orderManagementService.getOrdersByCategory(category);
        return allOrders.length;
    }

    public async getTotalRevenue(): Promise<number> {
        const allOrders: IIdentifiableOrderItem[] = await this.orderManagementService.getAllOrders();
        const revenue = allOrders.map(order => order.getPrice() * order.getQuantity());
        let total=0;
        for (const rev of revenue){
            total += rev;
        }
        return total;
    }

    public async getTotalRevenueByCategory(category: itemCategory): Promise<number> {
        const allOrders: IIdentifiableOrderItem[] = await this.orderManagementService.getOrdersByCategory(category);
        const revenue = allOrders.map(order => order.getPrice() * order.getQuantity());
        let total=0;
        for (const rev of revenue){
            total += rev;
        }
        return total;
    }
    
}