import { CSVCakeMapper, SQLiteCakeMapper } from "../../mappers/Cake.mapper";
import { IMapper } from "../../mappers/IMapper";
import { Cake } from "../../model/Cake.model";
import { DBMode } from "../../config/types";

export class CakeMapperFactory{
    public static create(mode: DBMode): IMapper<any, Cake>{
        switch(mode){
            case DBMode.FILE:
                return new CSVCakeMapper();
            case DBMode.SQLITE:
                return new SQLiteCakeMapper();
            case DBMode.POSTGRESQL:
                return new SQLiteCakeMapper();
            default:
                throw new Error("Unsupported Database Mode");
        }
    }
}