import { OrderController } from "../../src/controllers/order.controller";
import { OrderManagementService } from "../../src/services/orderManagement.service";
import { BadRequestException } from "../../src/util/exceptions/http/BadRequestException";
import { Request, Response } from "express";

const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const mockOrderService = (): jest.Mocked<OrderManagementService> =>
    ({
        createOrder: jest.fn(),
        getOrder: jest.fn(),
        getAllOrders: jest.fn(),
        updateOrder: jest.fn(),
        deleteOrder: jest.fn(),
    } as any);


import { JsonRequestFactory } from "../../src/mappers";

const mockJsonRequestFactory = (mappedOrder: any) => {
    (JsonRequestFactory.create as jest.Mock).mockReturnValue({
        map: jest.fn().mockReturnValue(mappedOrder)
    });
};

afterEach(() => {
    jest.restoreAllMocks();
});

describe("OrderController - createOrder", () => {

    it("should create order and return 201", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        const fakeOrder: any = { id: "1" };
        mockJsonRequestFactory(fakeOrder);

        service.createOrder.mockResolvedValue(fakeOrder);

        const req = {
            body: {
                category: "cake"
            }
        } as Request;

        const res = mockResponse();

        await controller.createOrder(req, res);

        expect(service.createOrder).toHaveBeenCalledWith(fakeOrder);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(fakeOrder);
    });

    it("should throw BadRequestException if order is missing", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        mockJsonRequestFactory(null);

        const req = {
            body: {
                category: "cake"
            }
        } as Request;

        const res = mockResponse();

        await expect(controller.createOrder(req, res))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });
});

describe("OrderController - getOrder", () => {

    it("should return order by id", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        const fakeOrder = { id: "123" };
        service.getOrder.mockResolvedValue(fakeOrder as any);

        const req = {
            params: { id: "123" }
        } as unknown as Request;

        const res = mockResponse();

        await controller.getOrder(req, res);

        expect(service.getOrder).toHaveBeenCalledWith("123");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeOrder);
    });

    it("should throw BadRequestException if id is missing", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        const req = { params: {} } as Request;
        const res = mockResponse();

        await expect(controller.getOrder(req, res))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });
});

describe("OrderController - getOrders", () => {

    it("should return all orders", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        const orders = [{ id: "1" }, { id: "2" }];
        service.getAllOrders.mockResolvedValue(orders as any);

        const req = {} as Request;
        const res = mockResponse();

        await controller.getOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(orders);
    });
});

/* ==================== deleteOrder ==================== */

describe("OrderController - deleteOrder", () => {

    it("should delete order and return 204", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        const req = {
            params: { id: "1" }
        } as unknown as Request;

        const res = mockResponse();

        await controller.deleteOrder(req, res);

        expect(service.deleteOrder).toHaveBeenCalledWith("1");
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });
});

/* ==================== updateOrder ==================== */

describe("OrderController - updateOrder", () => {

    it("should update order and return 200", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        const fakeOrder: any = {
            getId: () => "1"
        };

        mockJsonRequestFactory(fakeOrder);
        service.updateOrder.mockResolvedValue(fakeOrder);

        const req = {
            params: { id: "1" },
            body: {
                identifiableItem: { type: "cake" }
            }
        } as any as Request;

        const res = mockResponse();

        await controller.updateOrder(req, res);

        expect(service.updateOrder).toHaveBeenCalledWith(fakeOrder);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeOrder);
    });

    it("should throw BadRequestException if id param is missing", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        const req = { params: {} } as Request;
        const res = mockResponse();

        await expect(controller.updateOrder(req, res))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });

    it("should throw BadRequestException if category is missing", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        const req = {
            params: { id: "1" },
            body: {}
        } as any as Request;

        const res = mockResponse();

        await expect(controller.updateOrder(req, res))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });

    it("should throw BadRequestException if mapped order is null", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        mockJsonRequestFactory(null);

        const req = {
            params: { id: "1" },
            body: {
                identifiableItem: { type: "cake" }
            }
        } as any as Request;

        const res = mockResponse();

        await expect(controller.updateOrder(req, res))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });

    it("should throw BadRequestException if body id differs from url id", async () => {
        const service = mockOrderService();
        const controller = new OrderController(service);

        const fakeOrder: any = {
            getId: () => "999"
        };

        mockJsonRequestFactory(fakeOrder);

        const req = {
            params: { id: "1" },
            body: {
                identifiableItem: { type: "cake" }
            }
        } as any as Request;

        const res = mockResponse();

        await expect(controller.updateOrder(req, res))
            .rejects
            .toBeInstanceOf(BadRequestException);
    });
});
