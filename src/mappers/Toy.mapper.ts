import { ToyBuilder } from "../model/builders/Toy.builder";
import { Toy } from "../model/Toy.model";
import { IMapper } from "./IMapper";

export class XMLToyMapper implements IMapper<any, Toy> {
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