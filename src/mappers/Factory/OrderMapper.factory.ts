<<<<<<< HEAD
import { DBMode } from "../../repository/Repository.factory";
=======
import { DBMode } from "../../config/types";
>>>>>>> module-4.1
import { itemCategory, IItem } from "../../model/IItem";
import { IMapper } from "../IMapper";
import { IOrder } from "../../model/IOrder";

import { CSVOrderMapper, JsonOrderMapper, SQLiteOrderMapper, XMLOrderMapper } from "../Order.mapper";

import { CakeMapperFactory } from "./CakeMapper.factory";
import { BookMapperFactory } from "./BookMapper.factory";
import { ToyMapperFactory } from "./ToyMapper.factory";

export class MapperFactory {

    public static createOrderMapper(mode: DBMode, category: itemCategory): IMapper<any, IOrder> {
        let itemMapper: IMapper<any, IItem>;
        switch (category) {
            case itemCategory.CAKE:
                itemMapper = CakeMapperFactory.create(mode); 
                break;
            case itemCategory.BOOK: 
                itemMapper = BookMapperFactory.create(mode);
                break;
            case itemCategory.TOY:
                itemMapper = ToyMapperFactory.create(mode);
                break;
            default:
                throw new Error("Unsupported item category.");
        }
        switch (mode) {
            case DBMode.SQLITE:
                return new SQLiteOrderMapper();
            case DBMode.POSTGRESQL:
                return new SQLiteOrderMapper();
            case DBMode.FILE:
                switch (category) {
                    case itemCategory.CAKE:
                        return new CSVOrderMapper(itemMapper);
                    case itemCategory.BOOK:
                        return new JsonOrderMapper(itemMapper);
                    case itemCategory.TOY:
                        return new XMLOrderMapper(itemMapper);
                    default:
                        throw new Error("Unsupported Category");
                }
            default:
                throw new Error("Unsupported Database mode for OrderMapper");
        }
    }
}
