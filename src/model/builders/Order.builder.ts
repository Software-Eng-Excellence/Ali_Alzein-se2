import { IItem } from "../IItem";
import { Order } from "../Order.model";

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