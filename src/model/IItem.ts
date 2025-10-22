import { ID } from "repository/IRepository";

export interface IItem {
    getCategory(): itemCategory;
}

export interface IIdentifiableItem extends IItem, ID {}

export enum itemCategory {
    CAKE = "cake",
    BOOK = "book",
    TOY = "toy",
}