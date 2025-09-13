import { OrderManager, FinanceCalculator, Validator, ItemValidator, PriceValidator, MaxPriceValidator } from "./app";
import logger from "../src/util/logger";

const orders = [
  { id: 1, item: "Sponge", price: 15 },
  { id: 2, item: "Chocolate", price: 20 },
  { id: 3, item: "Fruit", price: 18 },
  { id: 4, item: "Red Velvet", price: 25 },
  { id: 5, item: "Coffee", price: 8 },
];
const rules=[
    new ItemValidator(),
    new PriceValidator(),
    new MaxPriceValidator()
];
const OrderManage= new OrderManager(new Validator(rules),new FinanceCalculator());
for( const order of orders){
    OrderManage.addOrder(order.item, order.price);
}

const item1:string="Sponge";
const price1:number=30;
OrderManage.addOrder(item1, price1);
logger.info("Orders after adding a new order: %o", OrderManage.getOrders());

// Calculate Total Revenue directly
logger.info("Total Revenue:" + OrderManage.getTotalRevenue());

// Calculate Average Buy Power directly
logger.info("Average Buy Power:" + OrderManage.getAveragePower());

// Fetching an order directly
const fetchId = 2;
const fetchedOrder = OrderManage.getOrder(fetchId);
logger.info("Order with ID 2:%o", fetchedOrder);

// Attempt to fetch a non-existent order
const nonExistentId = 10;
const nonExistentOrder = OrderManage.getOrder(nonExistentId);
logger.info("Order with ID 10 (non-existent):" + nonExistentOrder);