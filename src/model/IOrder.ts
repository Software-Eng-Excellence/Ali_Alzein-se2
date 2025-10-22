import { id, ID } from "repository/IRepository";
import { IIdentifiableItem, IItem } from "./IItem";

export interface IOrder {
    getItem(): IItem,
    getQuantity(): number,
    getPrice(): number,
    getId(): id;
}

export interface IIdentifiableOrderItem extends IOrder, ID {
    getItem():IIdentifiableItem;
}