import { id } from "repository/IRepository";
import { IIdentifiableItem, IItem } from "../model/IItem";
import { IIdentifiableOrderItem, IOrder } from "./IOrder";

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

export class IdentifiableOrderItem implements IIdentifiableOrderItem {
    constructor(private identifiableItem: IIdentifiableItem, private quantity: number, private price: number, private id: string) {}
    getQuantity(): number {
        return this.quantity;
    }
    getPrice(): number {
        return this.price;
    }
    getId(): id {
        return this.id;
    }

    getItem(): IIdentifiableItem {
        return this.identifiableItem;
    }
}