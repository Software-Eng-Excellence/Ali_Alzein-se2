import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { itemCategory } from "../model/IItem";


export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    public async getOrderCount(req: Request, res: Response) {
        const count = await this.analyticsService.getOrderCount();
        res.status(200).json({orderCount: count});
    }

    public async getOrderCountByCategory(req: Request, res: Response) {
        const categoryMap = await this.analyticsService.getOrderCountByCategory();
        const result: {[key:string]: number} = {};
        categoryMap.forEach((value, key) => {
            result[key] = value;
        });
        res.status(200).json(result);
    }

    public async getOrderCountByCategory2(req: Request, res: Response) {
        const category = req.params.category as itemCategory;
        if(!category){
            throw new BadRequestException("Category is required", {CategoryNotDefined:true});
        }
        const count = await this.analyticsService.getOrderCountByCategory2(category);
        res.status(200).json({orderCount: count});
    }

    public async getTotalRevenue(req: Request, res: Response) {
        const revenue =  await this.analyticsService.getTotalRevenue();
        res.status(200).json({totalRevenue: revenue});
    }

    public async getTotalRevenueByCategory(req: Request, res: Response) {
        const category = req.params.category as itemCategory;
        if(!category){
            throw new BadRequestException("Category is required", {CategoryNotDefined:true});
        }
        const revenue = await this.analyticsService.getTotalRevenueByCategory(category);
        res.status(200).json({totalRevenue: revenue});
    }

}
