import {  itemCategory } from "../model/IItem";
import { JsonBookRequestMapper } from "./book.mapper";
import { JsonCakeRequestMapper } from "./Cake.mapper";
import { JsonToyRequestMapper } from "./Toy.mapper";
import { JsonRequestOrderMapper } from "./Order.mapper";


export class JsonRequestFactory{
    public static create(category: itemCategory): JsonRequestOrderMapper{
        switch(category){
            case itemCategory.BOOK:
                return new JsonRequestOrderMapper(new JsonBookRequestMapper());
            case itemCategory.CAKE:
                return new JsonRequestOrderMapper(new JsonCakeRequestMapper());
            case itemCategory.TOY:
                return new JsonRequestOrderMapper(new JsonToyRequestMapper());
            default:
                throw new Error(`No mapper found for category: ${category}`);
        }
    }
}