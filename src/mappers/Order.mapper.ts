import { IOrder } from "../model/IOrder";
import { OrderBuilder } from "../model/builders/Order.builder";
import { IMapper } from "./IMapper";
import { IItem } from "../model/IItem";

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
}

export class XMLOrderMapper implements IMapper<any, IOrder>{
    constructor(private itemMapper: IMapper<any, IItem>){}
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