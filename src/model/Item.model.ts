export interface Item {
    getCategory(): itemCategory;
}

export enum itemCategory {
    CAKE,
    BOOK,
    TOY,
}