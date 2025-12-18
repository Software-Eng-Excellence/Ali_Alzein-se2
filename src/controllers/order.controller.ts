import { Request, Response } from "express";
import { OrderManagementService } from "../services/orderManagement.service";
import { IdentifiableOrderItem } from "../model/Order.model";
import { JsonRequestFactory } from "../mappers";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";


export class OrderController {
    constructor(private readonly orderService: OrderManagementService) {}

    public async createOrder(req: Request, res: Response) {
        const order: IdentifiableOrderItem = JsonRequestFactory.create(req.body.category).map(req.body);
            if (!order) {
                throw new BadRequestException("Order is required to create order", {OrderNotDefined:true});
            }
        const newOrder = await this.orderService.createOrder(order);
            res.status(201).json(newOrder);
    }

    public async getOrder(req: Request, res: Response) {
        const orderId = req.params.id;
        if(!orderId){
            throw new BadRequestException("Order ID is required", {IdNotDefined:true});
        }
        const order = await this.orderService.getOrder(orderId);
        res.status(200).json(order);
    }

    public async getOrders(req: Request, res: Response) {
        const orders = await this.orderService.getAllOrders();
        res.status(200).json(orders);
    }

    public async updateOrder(req: Request, res:Response){
        const id = req.params.id;
        if(!id){
            throw new BadRequestException("Id is required", {IdNotDefined:true});
        }
        const category = req.body.identifiableItem?.type;
        if (!category) {
            throw new BadRequestException("Category is required", {CategoryNotDefined:true});
        }
        const order: IdentifiableOrderItem = JsonRequestFactory.create(category).map(req.body);
        if(!order){
            throw new BadRequestException("Order is required to update order", {OrderNotDefined:true});
        }
        if(order.getId()!== id){
            throw new BadRequestException("Id in body and url should be the same", {
                IdMismatch:true,
                IdInUrl: id,
                IdInBody: order.getId()
            }
            );
        }
        const updateOrder = await this.orderService.updateOrder(order);
        res.status(200).json(updateOrder);
    }

    public async deleteOrder(req: Request, res:Response){
        const id = req.params.id;
        if(!id){
            throw new BadRequestException("Id is required", {IdNotDefined:true});
        }
        await this.orderService.deleteOrder(id);
        res.status(204).send();
    }
}