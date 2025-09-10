//SRP

export interface Order{
    id: number;
    price: number;
    item: string;
}


export class OrderManager{
    private Orders: Order[]=[];
    constructor(private validator: IValidator, private calculator: ICalculator){

    }
    getOrders(){
        return this.Orders;
    }
    addOrder(item: string, price: number){
        const order: Order={id:this.Orders.length + 1, price,item};
        this.validator.validate(order)
        this.Orders.push(order);
    }
    getOrder(id:number){
        return this.getOrders().find(order=> order.id === id);
    }
    getTotalRevenue(){
        return this.calculator.getTotalRevenue(this.Orders);
    }
    getAveragePower(){
        return this.calculator.getAveragePower(this.Orders);
    }
}

export class PremuimOrderManager extends OrderManager{
    getOrder(id: number): Order | undefined {
        console.log("ALERT: This is a Premuim order being fetched");
        return super.getOrder(id);
    }
}

interface IValidator{
    validate(order:Order): void;
}

interface IPossibleItems{
    getPossibleItems(): string[];
}

export class Validator implements IValidator{
    constructor(private rules: IValidator[]){
    }

    validate(order: Order): void {
       this.rules.forEach(rule => rule.validate(order));
    }
}

export class ItemValidator implements IValidator , IPossibleItems{
    getPossibleItems(): string[] {
        return ItemValidator.possibleItems;
    }
    public static possibleItems = [
  "Sponge",
  "Chocolate",
  "Fruit",
  "Red Velvet",
  "Birthday",
  "Carrot",
  "Marble",
  "Coffee",
];
    validate(order: Order): void {
        if(!ItemValidator.possibleItems.includes(order.item)){
            throw new Error(`Invalid item. Must be on of ${ItemValidator.possibleItems.join(", ")}`)
        }
    }
}
export class PriceValidator implements IValidator{
    validate(order:Order){
      if(order.price <=0){
            throw new Error(`Invalid price, price must be positive`);
        }  
    }
}

export class MaxPriceValidator implements IValidator{
    validate(order: Order){
        if(order.price>100){
            throw new Error("Price must be less than 100");
        }
    }
}

interface ICalculator{
    getTotalRevenue(orders: Order[]): number;
    getAveragePower(orders: Order[]):number;
}

export class FinanceCalculator implements ICalculator{
      getTotalRevenue(Orders:Order[]){
        return Orders.reduce((total, order) => total + order.price, 0);
    }
     getAveragePower(Orders: Order[]){
        return Orders.length === 0 ? 0 : this.getTotalRevenue(Orders) / Orders.length;
    }
}