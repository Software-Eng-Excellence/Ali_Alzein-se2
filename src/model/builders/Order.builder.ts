import { IIdentifiableItem, IItem } from "../IItem";
import { IdentifiableOrderItem, Order } from "../Order.model";

export class OrderBuilder{
    private item!: IItem;
    private price!: number;
    private quantity!: number;
    private id!: string;

    public static newBuilder(): OrderBuilder {
        return new OrderBuilder();
    }

    setItem(item: IItem): OrderBuilder {
         this.item = item;
        return this;
    }
    setQuantity(quantity: number): OrderBuilder {
        this.quantity = quantity;
        return this;
    }
    setPrice(price: number): OrderBuilder {
        this.price = price;
        return this;
    }
    setId(id: string): OrderBuilder {
        this.id = id;
        return this;
    }

    build(): Order {
        const requiredProperties = [
            this.item,
            this.quantity,
            this.price,
            this.id
        ];
        for (const prop of requiredProperties) {
            if(!prop) {
                throw new Error("Missing required properties to build Order");
            }
        }
        return new Order(
                this.item,
                this.quantity,
                this.price,
                this.id
            );
    }

}

export class IdentifiableOrderItemBuilder{
    private item!: IIdentifiableItem;
    private order!: Order;

    static newBuilder(): IdentifiableOrderItemBuilder {
        return new IdentifiableOrderItemBuilder();
    }
    
    setItem(item: IIdentifiableItem): IdentifiableOrderItemBuilder {
         this.item = item;
        return this;
    }
    setOrder(order: Order): IdentifiableOrderItemBuilder {
        this.order = order;
        return this;
    }

    build(): IdentifiableOrderItem {
        const requiredProperties = [
            this.item,
            this.order
        ];
        for (const prop of requiredProperties) {
            if(!prop) {
                throw new Error("Missing required properties to build Identifiable Order");
            }
        }
        return new IdentifiableOrderItem(
                this.item,
                this.order.getQuantity(),
                this.order.getPrice(),
                this.order.getId()
            );
    }
}