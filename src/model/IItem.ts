export interface IItem {
    getCategory(): itemCategory;
}

export enum itemCategory {
    CAKE,
    BOOK,
    TOY,
}