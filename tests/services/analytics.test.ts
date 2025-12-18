import { AnalyticsService } from "../../src/services/analytics.service";
import { OrderManagementService } from "../../src/services/orderManagement.service";
import { itemCategory } from "../../src/model/IItem";

describe("AnalyticsService", () => {
  let analyticsService: AnalyticsService;
  let orderManagementService: jest.Mocked<OrderManagementService>;

  beforeEach(() => {
    orderManagementService = {
      getAllOrders: jest.fn(),
      getOrdersByCategory: jest.fn(),
    } as unknown as jest.Mocked<OrderManagementService>;

    analyticsService = new AnalyticsService(orderManagementService);
  });

  describe("getOrderCount", () => {
    it("should return total number of orders", async () => {
      orderManagementService.getAllOrders.mockResolvedValue([
        mockOrder(10, 2, itemCategory.CAKE),
        mockOrder(5, 1, itemCategory.TOY),
      ]);

      const result = await analyticsService.getOrderCount();

      expect(result).toBe(2);
      expect(orderManagementService.getAllOrders).toHaveBeenCalledTimes(1);
    });
  });

  describe("getOrderCountByCategory", () => {
    it("should group orders by category", async () => {
      orderManagementService.getAllOrders.mockResolvedValue([
        mockOrder(10, 1, itemCategory.CAKE),
        mockOrder(20, 2, itemCategory.CAKE),
        mockOrder(5, 1, itemCategory.TOY),
      ]);

      const result = await analyticsService.getOrderCountByCategory();

      expect(result.get(itemCategory.CAKE)).toBe(2);
      expect(result.get(itemCategory.TOY)).toBe(1);
    });
  });

  describe("getOrderCountByCategory2", () => {
    it("should return count for a single category", async () => {
      orderManagementService.getOrdersByCategory.mockResolvedValue([
        mockOrder(10, 1, itemCategory.CAKE),
        mockOrder(20, 2, itemCategory.CAKE),
      ]);

      const result = await analyticsService.getOrderCountByCategory2(itemCategory.CAKE);

      expect(result).toBe(2);
      expect(orderManagementService.getOrdersByCategory)
        .toHaveBeenCalledWith(itemCategory.CAKE);
    });
  });

  describe("getTotalRevenue", () => {
    it("should calculate total revenue correctly", async () => {
      orderManagementService.getAllOrders.mockResolvedValue([
        mockOrder(10, 2, itemCategory.CAKE),
        mockOrder(5, 3, itemCategory.TOY),
      ]);

      const result = await analyticsService.getTotalRevenue();

      expect(result).toBe(35);
    });
  });

  describe("getTotalRevenueByCategory", () => {
    it("should calculate revenue for a specific category", async () => {
      orderManagementService.getOrdersByCategory.mockResolvedValue([
        mockOrder(10, 2, itemCategory.CAKE),
        mockOrder(20, 1, itemCategory.CAKE),
      ]);

      const result = await analyticsService.getTotalRevenueByCategory(itemCategory.CAKE);

      expect(result).toBe(40);
    });
  });

  describe("Edge cases – empty orders", () => {
    it("should return 0 when there are no orders", async () => {
        orderManagementService.getAllOrders.mockResolvedValue([]);
        const count = await analyticsService.getOrderCount();
        expect(count).toBe(0);
    });
  });

    it("should return 0 revenue when there are no orders", async () => {
        orderManagementService.getAllOrders.mockResolvedValue([]);
        const revenue = await analyticsService.getTotalRevenue();
        expect(revenue).toBe(0);
    });

    it("should return 0 count when category has no orders", async () => {
        orderManagementService.getOrdersByCategory.mockResolvedValue([]);
        const result = await analyticsService.getOrderCountByCategory2(itemCategory.CAKE);
        expect(result).toBe(0);
    });

    it("should return 0 revenue when category has no orders", async () => {
        orderManagementService.getOrdersByCategory.mockResolvedValue([]);
        const revenue = await analyticsService.getTotalRevenueByCategory(itemCategory.TOY);
        expect(revenue).toBe(0);
    });

  describe("Error propagation", () => {
    it("should throw if OrderManagementService fails", async () => {
        orderManagementService.getAllOrders.mockRejectedValue(
        new Error("Database unreachable")
        );

        await expect(
        analyticsService.getOrderCount()
        ).rejects.toThrow("Database unreachable");
    });
  });

    it("should return empty map when there are no orders", async () => {
        orderManagementService.getAllOrders.mockResolvedValue([]);
        const result = await analyticsService.getOrderCountByCategory();
        expect(result.size).toBe(0);
    });
    
});

const mockOrder = (
  price: number,
  quantity: number,
  category: itemCategory
): any => ({
  getPrice: jest.fn().mockReturnValue(price),
  getQuantity: jest.fn().mockReturnValue(quantity),
  getItem: jest.fn().mockReturnValue({
    getCategory: jest.fn().mockReturnValue(category),
  }),
});