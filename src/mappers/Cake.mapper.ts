import { CakeBuilder, IdentifiableCakeBuilder } from "../model/builders/Cake.builder";
import { Cake, IdentifiableCake } from "../model/Cake.model";
import { IMapper } from "./IMapper";

export class CSVCakeMapper implements IMapper<string[], Cake> {
    map(data: string[]): Cake {
        return CakeBuilder.newBuilder()
            .setType(data[1])
            .setFlavor(data[2])
            .setFilling(data[3])
            .setSize(parseInt(data[4]))
            .setLayers(parseInt(data[5]))
            .setFrostingType(data[6])
            .setFrostingFlavor(data[7])
            .setDecorationType(data[8])
            .setDecorationColor(data[9])
            .setCustomMessage(data[10])
            .setShape(data[11])
            .setAllergies(data[12])
            .setSpecialIngredients(data[13])
            .setPackagingType(data[14])
            .build();
    }
        reverseMap(data: Cake): string[] {
            return[
                data.getType(),
                data.getFlavor(),
                data.getFilling(),
                String(data.getSize()),
                String(data.getLayers()),
                data.getFrostingType(),
                data.getFrostingFlavor(),
                data.getDecorationType(),
                data.getDecorationColor(),
                data.getCustomMessage(),
                data.getShape(),
                data.getAllergies(),
                data.getSpecialIngredients(),
                data.getPackagingType()
            ]
        }
}
export interface SQLiteCake {
    id: string;
    type: string;
    flavor: string;
    filling: string;
    size: number;
    layers: number;
    frosting_type: string;
    frosting_flavor: string;
    decoration_type: string;
    decoration_color: string;
    custom_message: string;
    shape: string;
    allergies: string;
    special_ingredients: string;
    packaging_type: string;
}
export class SQLiteCakeMapper implements IMapper<SQLiteCake, IdentifiableCake> {
    map(data: SQLiteCake): IdentifiableCake {
        return IdentifiableCakeBuilder.newBuilder()
            .setCake(CakeBuilder.newBuilder()
                .setType(data.type)
                .setFlavor(data.flavor)
                .setFilling(data.filling)
                .setSize(data.size)
                .setLayers(data.layers)
                .setFrostingType(data.frosting_type)     // ✅ safe
                .setFrostingFlavor(data.frosting_flavor)
                .setDecorationType(data.decoration_type)
                .setDecorationColor(data.decoration_color)
                .setCustomMessage(data.custom_message)
                .setShape(data.shape)
                .setAllergies(data.allergies)
                .setSpecialIngredients(data.special_ingredients)
                .setPackagingType(data.packaging_type)
                .build())
            .setId(data.id)
            .build();
    }

    reverseMap(data: IdentifiableCake): SQLiteCake {
        return {
            id: data.getId(),
            type: data.getType(),
            flavor: data.getFlavor(),
            filling: data.getFilling(),
            size: data.getSize(),
            layers: data.getLayers(),
            frosting_type: data.getFrostingType(),      // ✅ match DB
            frosting_flavor: data.getFrostingFlavor(),
            decoration_type: data.getDecorationType(),
            decoration_color: data.getDecorationColor(),
            custom_message: data.getCustomMessage(),
            shape: data.getShape(),
            allergies: data.getAllergies(),
            special_ingredients: data.getSpecialIngredients(),
            packaging_type: data.getPackagingType()
        };
    }
}
