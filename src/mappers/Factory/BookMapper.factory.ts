import { JsonBookMapper, SQLiteBookMapper } from "../../mappers/book.mapper";
import { IMapper } from "../../mappers/IMapper";
import { Book } from "../../model/Book.model";
import { DBMode } from "../../config/types";


export class BookMapperFactory{
    public static create (mode: DBMode): IMapper<any, Book>{
        switch(mode){
            case DBMode.FILE:
                return new JsonBookMapper();
            case DBMode.SQLITE:
                return new SQLiteBookMapper();
            case DBMode.POSTGRESQL:
                return new SQLiteBookMapper();
            default:
                throw new Error("Unsupported Database Mode");
        }
    }
}