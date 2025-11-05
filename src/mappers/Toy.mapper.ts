import { IdentifiableToyBuilder, ToyBuilder } from "../model/builders/Toy.builder";
import { IdentifiableToy, Toy } from "../model/Toy.model";
import { IMapper } from "./IMapper";

export class XMLToyMapper implements IMapper<any, Toy> {
        reverseMap(data: Toy) {
            throw new Error("Method not implemented.");
        }
        map(data: any): Toy {
        return ToyBuilder.newBuilder()
            .setType(data.Type)
            .setAgeGroup(data.AgeGroup)
            .setBrand(data.Brand)
            .setMaterial(data.Material)
            .setBatteryRequired(data.BatteryRequired)
            .setEducational(data.Educational)
            .build();
    }
}

export interface SQLiteToy{
    id: string;
    type: string;
    agegroup: string;
    brand: string
    material: string;
    batteryrequired:  string;
    educational: string;
}

export class SQLiteToyMapper implements IMapper<SQLiteToy,IdentifiableToy>{
    map(data: SQLiteToy): IdentifiableToy {
        return IdentifiableToyBuilder.newBuilder()
            .setToy(ToyBuilder.newBuilder()
                .setType(data.type)
                .setAgeGroup(data.agegroup)
                .setBrand(data.brand)
                .setMaterial(data.material)
                .setBatteryRequired(data.batteryrequired)
                .setEducational(data.educational)
                .build()
                )
            .setId(data.id)
            .build();    
    }
    reverseMap(data: IdentifiableToy): SQLiteToy {
        return {
            id: data.getId(),
            type: data.getType(),
            agegroup: data.getAgeGroup(),
            brand: data.getBrand(),
            material: data.getMaterial(),
            batteryrequired: data.isBatteryRequired(),
            educational: data.isEducational()
        }
    }
    
}