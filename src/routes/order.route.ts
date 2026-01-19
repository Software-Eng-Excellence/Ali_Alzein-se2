import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderManagementService } from "../services/OrderManagement.service";
import { asyncHandler } from "../middleware/asyncHandler";
import { hasPermission } from "../middleware/authorize";
import { PERMISSION } from "../config/roles";

const orderController = new OrderController(new OrderManagementService());

const route = Router();

route.route('/')
     .get(asyncHandler(orderController.getOrders.bind(orderController)))
     .post(asyncHandler(orderController.createOrder.bind(orderController)));

route.route('/:id')
     .get(hasPermission(PERMISSION.READ_ORDER) ,asyncHandler(orderController.getOrder.bind(orderController)))
     .delete(hasPermission(PERMISSION.UPDATE_ORDER) ,asyncHandler(orderController.deleteOrder.bind(orderController)))
     .put(hasPermission(PERMISSION.DELETE_ORDER) ,asyncHandler(orderController.updateOrder.bind(orderController)));



export default route;