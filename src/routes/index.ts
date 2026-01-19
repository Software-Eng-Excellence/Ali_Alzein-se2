import { Router } from "express";
import OrderRoutes from "./order.route"
import AnalyticsRoutes from "./analytics.route"
import createUserRouter from "./user.route"
import authRoutes from "./auth.route"
import { Authenticate } from "../middleware/auth";

const routes = Router();

routes.use('/orders', Authenticate, OrderRoutes);

routes.use('/analytics', Authenticate, AnalyticsRoutes);

routes.use('/users', createUserRouter);

routes.use('/auth', authRoutes)

export default routes;