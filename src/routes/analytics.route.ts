import { AnalyticsController } from "../controllers/analytics.controller";
import { Router } from "express";
import { AnalyticsService } from "../services/Analytics.service";
import { OrderManagementService } from "../services/OrderManagement.service";
import { asyncHandler } from "../middleware/asyncHandler";

const route = Router();
const analyticsController = new AnalyticsController(new AnalyticsService(new OrderManagementService()));

route.route('/OrderCount').get(asyncHandler(analyticsController.getOrderCount.bind(analyticsController)));
route.route('/OrderCountByCategory').get(asyncHandler(analyticsController.getOrderCountByCategory.bind(analyticsController)));
route.route('/OrderCountByCategory/:category').get(asyncHandler(analyticsController.getOrderCountByCategory2.bind(analyticsController)));

route.route('/TotalRevenue').get(asyncHandler(analyticsController.getTotalRevenue.bind(analyticsController)));
route.route('/TotalRevenue/:category').get(asyncHandler(analyticsController.getTotalRevenueByCategory.bind(analyticsController)));

export default route;