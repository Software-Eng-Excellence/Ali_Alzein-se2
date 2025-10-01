import { Toy } from "../Toy.model";
import logger from "../../util/logger";

export class ToyBuilder {
    private type!: string;
    private ageGroup!: string;
    private brand!: string;
    private material!: string;
    private batteryRequired!: string;
    private educational!: string;

    public static newBuilder(): ToyBuilder {
        return new ToyBuilder();
    }


    setType(type: string): ToyBuilder {
        this.type = type;
        return this;
    }

    setAgeGroup(ageGroup: string): ToyBuilder {
        this.ageGroup = ageGroup;
        return this;
    }

    setBrand(brand: string): ToyBuilder {
        this.brand = brand;
        return this;
    }

    setMaterial(material: string): ToyBuilder {
        this.material = material;
        return this;
    }

    setBatteryRequired(batteryRequired: string): ToyBuilder {
        this.batteryRequired = batteryRequired;
        return this;
    }

    setEducational(educational: string): ToyBuilder {
        this.educational = educational;
        return this;
    }

    build(): Toy {
        const requiredProperties = [
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational,
        ];
        for (const prop of requiredProperties) {
            if (!prop) {
                logger.error("Missing required property for Toy, cannot build Toy instance");
                throw new Error("Missing required property for Toy");
            }        
        }
        return new Toy(
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteryRequired,
            this.educational
        );
    }
}