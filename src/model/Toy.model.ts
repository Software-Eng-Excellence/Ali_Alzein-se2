import { Item, itemCategory } from "./Item.model";

type materialType = "Plastic" | "Wood" | "Metal" | "Fabric" | "Other";
type ageGroup = "0-2" | "3-5" | "6-8" | "9-12" | "13+" ;

export class Toy implements Item {
    getCategory(): itemCategory {
        return itemCategory.TOY;
    }

    constructor(
        private orderId: number,
        private type: string,
        private ageGroup: ageGroup,
        private brand: string,
        private material: materialType,
        private batteryRequired: boolean,
        private educational: boolean,
        private price: number,
        private quantity: number
    ) {
        this.orderId = orderId;
        this.type = type;
        this.ageGroup = ageGroup;
        this.brand = brand;
        this.material = material;
        this.batteryRequired = batteryRequired;
        this.educational = educational;
        this.price = price;
        this.quantity = quantity;
    }

    getOrderId(): number {
        return this.orderId;
    }

    getType(): string {
        return this.type;
    }

    getAgeGroup(): ageGroup {
        return this.ageGroup;
    }

    getBrand(): string {
        return this.brand;
    }

    getMaterial(): materialType {
        return this.material;
    }

    isBatteryRequired(): boolean {
        return this.batteryRequired;
    }

    isEducational(): boolean {
        return this.educational;
    }

    getPrice(): number {
        return this.price;
    }

    getQuantity(): number {
        return this.quantity;
    }
}
