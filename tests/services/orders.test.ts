import { OrderManagementService } from "../../src/services/orderManagement.service";
import { RepositoryFactory } from "../../src/repository/Repository.factory";
import { itemCategory } from "../../src/model/IItem";
import { BadRequestException } from "../../src/util/exceptions/http/BadRequestException";
import { NotFoundException } from "../../src/util/exceptions/http/NotFoundException";
import { IRepository } from "../../src/repository/IRepository";

describe("OrderManagementService", () => {
  let service: OrderManagementService;
  let mockRepo: jest.Mocked<IRepository<any>>;

  beforeEach(() => {
    service = new OrderManagementService();

    mockRepo = {
      create: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAll: jest.fn(),
    };

    jest
      .spyOn(RepositoryFactory, "create")
      .mockResolvedValue(mockRepo as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /* ---------------- helpers ---------------- */

  const validOrder = (category = itemCategory.CAKE): any => ({
    getPrice: jest.fn().mockReturnValue(10),
    getQuantity: jest.fn().mockReturnValue(2),
    getItem: jest.fn().mockReturnValue({
      getCategory: jest.fn().mockReturnValue(category),
    }),
  });

    it("should create an order", async () => {
    const order = validOrder();
    const result = await service.createOrder(order);
    expect(mockRepo.create).toHaveBeenCalledWith(order);
    expect(result).toBe(order);
  });

    it("should throw BadRequestException for invalid order", async () => {
    const invalidOrder: any = {
      getPrice: jest.fn().mockReturnValue(-5),
      getQuantity: jest.fn().mockReturnValue(0),
      getItem: jest.fn().mockReturnValue(null),
    };

    await expect(service.createOrder(invalidOrder))
      .rejects.toBeInstanceOf(BadRequestException);
  });

    it("should return order when found in a category", async () => {
    const order = validOrder();
    mockRepo.get.mockResolvedValue(order);
    const result = await service.getOrder("123");
    expect(result).toBe(order);
    expect(RepositoryFactory.create).toHaveBeenCalled();
  });

    it("should throw NotFoundException if order does not exist", async () => {
    mockRepo.get.mockRejectedValue(new Error("not found"));
    await expect(service.getOrder("999"))
      .rejects.toBeInstanceOf(NotFoundException);
  });

    it("should update an order", async () => {
    const order = validOrder();

    await service.updateOrder(order);

    expect(mockRepo.update).toHaveBeenCalledWith(order);
  });

    it("should throw BadRequestException when updating invalid order", async () => {
    const invalidOrder: any = {
      getPrice: jest.fn().mockReturnValue(-1),
      getQuantity: jest.fn().mockReturnValue(1),
      getItem: jest.fn().mockReturnValue(null),
    };

    await expect(service.updateOrder(invalidOrder))
      .rejects.toBeInstanceOf(BadRequestException);
  });

    it("should delete order if found", async () => {
    mockRepo.get.mockResolvedValue(validOrder());

    await service.deleteOrder("123");

    expect(mockRepo.delete).toHaveBeenCalledWith("123");
  });

    it("should throw NotFoundException if order does not exist", async () => {
    mockRepo.get.mockResolvedValue(null);

    await expect(service.deleteOrder("999"))
      .rejects.toBeInstanceOf(NotFoundException);
  });

    it("should return combined orders from all categories", async () => {
    mockRepo.getAll.mockResolvedValue([
      validOrder(itemCategory.CAKE),
    ]);

    const result = await service.getAllOrders();

    expect(result.length).toBeGreaterThan(0);
    expect(mockRepo.getAll).toHaveBeenCalled();
  });

    it("should return orders for a single category", async () => {
    mockRepo.getAll.mockResolvedValue([
      validOrder(itemCategory.TOY),
    ]);

    const result = await service.getOrdersByCategory(itemCategory.TOY);

    expect(result.length).toBe(1);
  });

    it("should calculate total revenue", async () => {
    mockRepo.getAll.mockResolvedValue([
      {
        getPrice: () => 10,
        getQuantity: () => 2,
      },
      {
        getPrice: () => 5,
        getQuantity: () => 3,
      },
    ]);

    const revenue = await service.getTotalRevenue();

    expect(revenue).toBe(35);
  });
});