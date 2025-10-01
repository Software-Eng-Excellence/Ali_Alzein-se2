import { IItem } from "../model/IItem";
import { IOrder } from "./IOrder";

export class Order implements IOrder {
    private item: IItem;
    private quantity: number
    private price: number
    private id: string
    constructor(item: IItem, quantity: number, price: number, id: string) {
        this.item = item;
        this.quantity = quantity;
        this.price = price;
        this.id = id;
    }

    getItem(): IItem {
        return this.item;
    }
    getQuantity(): number {
        return this.quantity;
    }
    getPrice(): number {
        return this.price;
    }
    getId(): string {
        return this.id;
    }

}