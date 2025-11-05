import { id } from "repository/IRepository";
import { IIdentifiableItem, IItem, itemCategory } from "./IItem";

export class Toy implements IItem {
    getCategory(): itemCategory {
        return itemCategory.TOY;
    }

    private type: string;
    private ageGroup: string;
    private brand: string;
    private material: string;
    private batteryRequired: string;
    private educational: string;

    constructor(
         type: string,
         ageGroup: string,
         brand: string,
         material: string,
         batteryRequired:  string,
         educational: string
    ) {
        this.type = type;
        this.ageGroup = ageGroup;
        this.brand = brand;
        this.material = material;
        this.batteryRequired = batteryRequired;
        this.educational = educational;
    }

    getType(): string {
        return this.type;
    }

    getAgeGroup(): string {
        return this.ageGroup;
    }

    getBrand(): string {
        return this.brand;
    }

    getMaterial(): string {
        return this.material;
    }

    isBatteryRequired(): string {
        return this.batteryRequired;
    }

    isEducational(): string {
        return this.educational;
    }

}

export class IdentifiableToy extends Toy implements IIdentifiableItem{

    constructor(private id:id,
        type: string,
        ageGroup: string,
        brand: string,
        material: string,
        batteryRequired:  string,
        educational: string 
    ){
        super(
            type,
            ageGroup,
            brand,
            material,
            batteryRequired,
            educational
        )
    }
    getId(): id {
        return this.id;
    }
    
}