import { Item } from "./Item.model";

export interface Order {
    getItem(): Item,
    getQuantity(): number,
    getPrice(): number,
    getId(): string;
}