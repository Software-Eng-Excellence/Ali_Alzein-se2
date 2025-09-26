import { Toy } from "../Toy.model";
import logger from "../../util/logger";

export class ToyBuilder {
    private orderId!: number;
    private type!: string;
    private ageGroup!: string;
    private brand!: string;
    private material!: string;
    private batteryRequired!: boolean;
    private educational!: boolean;
    private price!: number;
    private quantity!: number;

    public setOrderId(orderId: number): ToyBuilder {
        this.orderId = orderId;
        return this;
    }

    public setType(type: string): ToyBuilder {
        this.type = type;
        return this;
    }

    public setAgeGroup(ageGroup: string): ToyBuilder {
        this.ageGroup = ageGroup;
        return this;
    }

    public setBrand(brand: string): ToyBuilder {
        this.brand = brand;
        return this;
    }

    public setMaterial(material: string): ToyBuilder {
        this.material = material;
        return this;
    }

    public setBatteryRequired(batteryRequired: boolean): ToyBuilder {
        this.batteryRequired = batteryRequired;
        return this;
    }

    public setEducational(educational: boolean): ToyBuilder {
        this.educational = educational;
        return this;
    }

    public setPrice(price: number): ToyBuilder {
        this.price = price;
        return this;
    }

    public setQuantity(quantity: number): ToyBuilder {
        this.quantity = quantity;
        return this;
    }

    build(): Toy {
        const requiredProperties = [
            this.orderId,
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational,
            this.price,
            this.quantity
        ];
        for(const prop of requiredProperties) {
            if(prop === undefined) {
                logger.error("Missing required property for Toy, cannot build Toy instance");
                throw new Error("Missing required property for Toy");
            }
        }
        return new Toy(
            this.orderId,
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational,
            this.price,
            this.quantity
        );
    }
}