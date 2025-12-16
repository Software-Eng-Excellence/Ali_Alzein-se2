import { itemCategory } from "../model/IItem";
import { Initializable, IRepository } from "./IRepository";
import { IIdentifiableOrderItem, IOrder } from "../model/IOrder";
import { OrderRepository } from "./sqlite/Order.repository";
import { OrderRepository as POrderRepository} from "./PostgreSQL/Order.repository";
import { CakeRepository as PCakeRepository} from "./PostgreSQL/Cake.order.repository";
import { BookRepository as PBookRepository} from "./PostgreSQL/Book.order.repository";
import { ToyRepository as PToyRepository} from "./PostgreSQL/Toy.order.repository";
import { CakeRepository } from "./sqlite/Cake.order.repository";
import { CakeOrderRepository } from "./file/Cake.order.repository";
import config from "../config/index";

export enum DBMode {
    SQLITE,
    POSTGRESQL,
    FILE
}

export class RepositoryFactory {
    public static async create (mode: DBMode, category:itemCategory): Promise<IRepository<IIdentifiableOrderItem>>{
        switch(mode){
            case DBMode.SQLITE:
                let repository: IRepository<IIdentifiableOrderItem> & Initializable;
                switch (category) {
                    case itemCategory.CAKE:
                        repository = new OrderRepository(new CakeRepository());
                        break;
                        default:
                            throw new Error("Unsupported Category");
                }
                await repository.init();
                return repository;

            case DBMode.FILE:
                throw new Error("File DB Mode not supported yet");
            case DBMode.POSTGRESQL:
                let prepository: IRepository<IIdentifiableOrderItem> & Initializable;
                switch (category){
                    case itemCategory.CAKE:
                        prepository = new POrderRepository( new PCakeRepository());
                        break;
                    case itemCategory.BOOK:
                        prepository = new POrderRepository( new PBookRepository());
                        break;
                    case itemCategory.TOY:
                        prepository = new POrderRepository( new PToyRepository());
                        break;
                    default: throw new Error("Unsupported Category");
                }
            await prepository.init();
            return prepository;
            default:
                throw new Error("Unsupported DB Mode");
        }
    }
}