import { Router } from "express";
import OrderRoutes from "./order.route"
import AnalyticsRoutes from "./analytics.route"
import createUserRouter from "./user.route"

const routes = Router();

routes.use('/orders', OrderRoutes);

routes.use('/analytics', AnalyticsRoutes);

routes.use('/users', createUserRouter);

export default routes;