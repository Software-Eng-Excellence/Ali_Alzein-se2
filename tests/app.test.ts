import {FinanceCalculator, Order, OrderManager, Validator} from "../src/app";

describe("OrderManager", () => {

    let validator: Validator;
    let calculator: FinanceCalculator;
    let orderManager: OrderManager;
    let basevalidator:(order: Order)=> void;

    beforeAll(() => {
        validator = new Validator([]);
        calculator = new FinanceCalculator();
    });
    beforeEach(() => {
        basevalidator=validator.validate;
        validator.validate=jest.fn();
        orderManager = new OrderManager(validator, calculator);
    });
    afterEach(() => {
        validator.validate=basevalidator;
    });
    it("should add an order", () => {
        //Arrange
        const item = "spaghetti";
        const price = 12.5;
        //Act
        orderManager.addOrder(item, price);
        //Assert
        expect(orderManager.getOrders()).toEqual([{id:1, item, price}]);
    });

    it("should throw addition exception if validator doesnot pass", () => {
        //Arrange
        const item = "spaghetti";
        const price = 12.5;
        (validator.validate as jest.Mock).mockImplementation(()=>{
            throw new Error("Invalid Order");
        });
        
        //Act and Assert
        expect(()=> orderManager.addOrder(item, price)).toThrow("[OrderManager Error]: Error Adding Order Invalid Order");
    });

    
    it("should fetch an order by ID", () => {
        //Arrange
        const validator=new Validator([]);
        const calculator= new FinanceCalculator();
        const orderManager = new OrderManager(validator, calculator);
        orderManager.addOrder("spaghetti", 12.5);
        orderManager.addOrder("pizza", 15.0);
        //Act
        const order = orderManager.getOrder(2);
        //Assert
        expect(order).toEqual({id:2, item:"pizza", price:15.0});
    });
});
describe("FinanceCalculator", () => {

    it("should calculate total revenue", () => {
        //Arrange
        const validator=new Validator([]);
        const calculator= new FinanceCalculator();
        const orderManager = new OrderManager(validator, calculator);
        orderManager.addOrder("spaghetti", 12.5);
        orderManager.addOrder("pizza", 15.0);
        const spy= jest.spyOn(calculator, 'getTotalRevenue');
        //Act
        orderManager.getTotalRevenue();
        //Assert
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveReturnedWith(27.5);
    });
    it("should calculate average buy power", () => {
        //Arrange
        const validator=new Validator([]);
        const calculator= new FinanceCalculator();
        const orderManager = new OrderManager(validator, calculator);
        orderManager.addOrder("spaghetti", 12.5);
        orderManager.addOrder("pizza", 15.0);
        //Act
        const averagePower = orderManager.getAveragePower();
        //Assert
        expect(averagePower).toBe(13.75);
    });
});