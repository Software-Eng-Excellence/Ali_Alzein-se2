import { Response } from "express";
import {AnalyticsService} from "../../src/services/analytics.service";
export const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const analyticsServiceMock = {
    getOrderCount: jest.fn(),
    getOrderCountByCategory: jest.fn(),
    getOrderCountByCategory2: jest.fn(),
    getTotalRevenue: jest.fn(),
    getTotalRevenueByCategory: jest.fn(),
} as unknown as jest.Mocked<AnalyticsService>;

// analytics.controller.spec.ts
import { AnalyticsController } from "../../src/controllers/analytics.controller";
import { Request } from "express";
import { BadRequestException } from "../../src/util/exceptions/http/BadRequestException";
import { itemCategory } from "../../src/model/IItem";

describe("AnalyticsController", () => {
    let controller: AnalyticsController;
    let analyticsService: jest.Mocked<AnalyticsService>;

    beforeEach(() => {
        analyticsService = {
            getOrderCount: jest.fn(),
            getOrderCountByCategory: jest.fn(),
            getOrderCountByCategory2: jest.fn(),
            getTotalRevenue: jest.fn(),
            getTotalRevenueByCategory: jest.fn(),
        } as unknown as jest.Mocked<AnalyticsService>;

        controller = new AnalyticsController(analyticsService);
    });

    describe("getOrderCount", () => {
        it("should return order count", async () => {
            analyticsService.getOrderCount.mockResolvedValue(10);

            const req = {} as Request;
            const res = mockResponse();

            await controller.getOrderCount(req, res);

            expect(analyticsService.getOrderCount).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ orderCount: 10 });
        });
    });

    describe("getOrderCountByCategory", () => {
        it("should return counts per category", async () => {
            const map = new Map<string, number>([
                ["Cake", 5],
                ["Toy", 3],
            ]);

            analyticsService.getOrderCountByCategory.mockResolvedValue(map);

            const req = {} as Request;
            const res = mockResponse();

            await controller.getOrderCountByCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                Cake: 5,
                Toy: 3,
            });
        });
    });

    describe("getOrderCountByCategory2", () => {
        it("should return count for a category", async () => {
            analyticsService.getOrderCountByCategory2.mockResolvedValue(7);

            const req = {
                params: { category: "Cake" },
            } as unknown as Request;

            const res = mockResponse();

            await controller.getOrderCountByCategory2(req, res);

            expect(analyticsService.getOrderCountByCategory2)
                .toHaveBeenCalledWith("Cake" as itemCategory);

            expect(res.json).toHaveBeenCalledWith({ orderCount: 7 });
        });

        it("should throw BadRequestException if category missing", async () => {
            const req = { params: {} } as Request;
            const res = mockResponse();

            await expect(
                controller.getOrderCountByCategory2(req, res)
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });

    describe("getTotalRevenue", () => {
        it("should return total revenue", async () => {
            analyticsService.getTotalRevenue.mockResolvedValue(2500);

            const req = {} as Request;
            const res = mockResponse();

            await controller.getTotalRevenue(req, res);

            expect(res.json).toHaveBeenCalledWith({ totalRevenue: 2500 });
        });
    });

    describe("getTotalRevenueByCategory", () => {
        it("should return revenue by category", async () => {
            analyticsService.getTotalRevenueByCategory.mockResolvedValue(900);

            const req = {
                params: { category: "Cake" },
            } as unknown as Request;

            const res = mockResponse();

            await controller.getTotalRevenueByCategory(req, res);

            expect(analyticsService.getTotalRevenueByCategory)
                .toHaveBeenCalledWith("Cake" as itemCategory);

            expect(res.json).toHaveBeenCalledWith({ totalRevenue: 900 });
        });

        it("should throw BadRequestException if category missing", async () => {
            const req = { params: {} } as Request;
            const res = mockResponse();

            await expect(
                controller.getTotalRevenueByCategory(req, res)
            ).rejects.toBeInstanceOf(BadRequestException);
        });
    });
});

