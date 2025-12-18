import { IMapper } from "../../mappers/IMapper";
import { SQLiteToyMapper, XMLToyMapper } from "../../mappers/Toy.mapper";
import { Toy } from "../../model/Toy.model";
import { DBMode } from "../../config/types";

export class ToyMapperFactory{
    public static create( mode: DBMode): IMapper<any, Toy>{
        switch (mode){
            case DBMode.FILE:
                return new XMLToyMapper();
            case DBMode.SQLITE:
                return new SQLiteToyMapper();
            case DBMode.POSTGRESQL:
                return new SQLiteToyMapper();
            default:
                throw new Error("Unsupported Database Mode");
        }
    }
}