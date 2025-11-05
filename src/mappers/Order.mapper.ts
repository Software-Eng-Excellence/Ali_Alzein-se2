import { IIdentifiableOrderItem, IOrder } from "../model/IOrder";
import { IdentifiableOrderItemBuilder, OrderBuilder } from "../model/builders/Order.builder";
import { IMapper } from "./IMapper";
import { IIdentifiableItem, IItem } from "../model/IItem";
import { IdentifiableOrderItem } from "../model/Order.model";

export class CSVOrderMapper implements IMapper<string[], IOrder> {
    constructor(private itemMapper: IMapper<string[], IItem>) {}
    map(data: string[]): IOrder {
        const item: IItem = this.itemMapper.map(data);
        return OrderBuilder.newBuilder()
        .setId(data[0])
        .setQuantity(parseInt(data[data.length - 1]))
        .setPrice(parseInt(data[data.length - 2]))
        .setItem(item)
        .build();
    }
        reverseMap(data: IOrder): string[] {
            const item = this.itemMapper.reverseMap(data.getItem());
            return [
              data.getId(),
              ...item,
              data.getPrice().toString(),
              data.getQuantity().toString()
            ];  
        }
}
export interface ISQLiteOrder{
    id: string;
    quantity: number;
    price: number;
    item_category: string;
    item_id: string;
}

export interface SQLiteOrder {
    id: string;
    quantity: number;
    price: number;
    item_category: string;
    item_id: string;
}

export class SQLiteOrderMapper implements IMapper<{data: SQLiteOrder, item:IIdentifiableItem}, IIdentifiableOrderItem> {
    
    map({ data, item }: { data: SQLiteOrder, item: IIdentifiableItem }): IIdentifiableOrderItem {
        return new IdentifiableOrderItem(
            item,
            data.quantity,
            data.price,
            data.id
        );
    }

    reverseMap(data: IIdentifiableOrderItem): { data: SQLiteOrder, item: IIdentifiableItem } {
    return {
        data: {
        id: data.getId(),
        quantity: data.getQuantity(),
        price: data.getPrice(),
        item_category: data.getItem().getCategory(),
        item_id: data.getItem().getId()
        },
        item: data.getItem()
    };
    }

}

export class XMLOrderMapper implements IMapper<any, IOrder>{
    constructor(private itemMapper: IMapper<any, IItem>){}
    reverseMap(data: IOrder) {
        throw new Error("Method not implemented.");
    }
    map(data: any): IOrder {
        const item: IItem= this.itemMapper.map(data);
        return OrderBuilder.newBuilder()
        .setId(data.OrderID)
        .setQuantity(Number(data.Quantity))
        .setPrice(Number(data.Price))
        .setItem(item)
        .build();
    }
}

export class JsonOrderMapper implements IMapper<any, IOrder>{
    constructor(private itemMapper: IMapper<any, IItem>){}
    reverseMap(data: IOrder) {
        throw new Error("Method not implemented.");
    }
    map(data: any): IOrder {
        const item: IItem=this.itemMapper.map(data)
        return OrderBuilder.newBuilder()
        .setId(data['Order ID'])
        .setQuantity(Number(data['Quantity']))
        .setPrice(Number(data['Price']))
        .setItem(item)
        .build();
    }   
}