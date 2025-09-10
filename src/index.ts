import { OrderManager, FinanceCalculator, Validator, ItemValidator, PriceValidator, MaxPriceValidator } from "app";

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


// Calculate Total Revenue directly
console.log("Total Revenue:", OrderManage.getTotalRevenue());

// Calculate Average Buy Power directly
console.log("Average Buy Power:", OrderManage.getAveragePower());

// Fetching an order directly
const fetchId = 2;
const fetchedOrder = OrderManage.getOrder(fetchId);
console.log("Order with ID 2:", fetchedOrder);

// Attempt to fetch a non-existent order
const nonExistentId = 10;
const nonExistentOrder = OrderManage.getOrder(nonExistentId);
console.log("Order with ID 10 (non-existent):", nonExistentOrder);