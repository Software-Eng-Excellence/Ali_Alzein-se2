import { Item, itemCategory } from "./Item.model";
type type = "Birthday" | "Wedding" | "Anniversary" | "Graduation" | "Other";
export class Cake implements Item {
    getCategory(): itemCategory {
        return itemCategory.CAKE;
    }
    private id: number;
    private type: type;
    private flavor: string;
    private filling: string;
    private size: number;
    private layers: number;
    private frostingType: string;
    private frostingFlavor: string;
    private decorationType: string;
    private decorationColor: string;
    private customMessage: string;
    private shape: string;
    private allergies: string;
    private specialIngredients: string;
    private packagingType: string;
    private price: number;
    private quantity: number;

    constructor(
    id: number,
    type: type,
    flavor: string,
    filling: string,
    size: number,
    layers: number,
    frostingType: string,
    frostingFlavor: string,
    decorationType: string,
    decorationColor: string,
    customMessage: string,
    shape: string,
    allergies: string,
    specialIngredients: string,
    packagingType: string,
    price: number,
    quantity: number
) {
    this.id = id;
    this.type = type;
    this.flavor = flavor;
    this.filling = filling;
    this.size = size;
    this.layers = layers;
    this.frostingType = frostingType;
    this.frostingFlavor = frostingFlavor;
    this.decorationType = decorationType;
    this.decorationColor = decorationColor;
    this.customMessage = customMessage;
    this.shape = shape;
    this.allergies = allergies;
    this.specialIngredients = specialIngredients;
    this.packagingType = packagingType;
    this.price = price;
    this.quantity = quantity;
}
    getId(): number {
        return this.id;
    }
    getType(): type {
        return this.type;
    }
    getFlavor(): string {
        return this.flavor;
    }
    getFilling(): string {
        return this.filling;
    }
    getSize(): number {
        return this.size;
    }
    getLayers(): number {
        return this.layers;
    }
    getFrostingType(): string {
        return this.frostingType;
    }
    getFrostingFlavor(): string {
        return this.frostingFlavor;
    }
    getDecorationType(): string {
        return this.decorationType;
    }
    getDecorationColor(): string {
        return this.decorationColor;
    }
    getCustomMessage(): string {
        return this.customMessage;
    }
    getShape(): string {
        return this.shape;
    }
    getAllergies(): string {
        return this.allergies;
    }
    getSpecialIngredients(): string {
        return this.specialIngredients;
    }
    getPackagingType(): string {
        return this.packagingType;
    }
    getPrice(): number {
        return this.price;
    }
    getQuantity(): number {
        return this.quantity;
    }
    
}

