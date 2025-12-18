import { HttpException } from "./HException";

export class NotFoundException extends HttpException {
    constructor(message: string = "Resource not found", details?: Record<string, unknown>) {
        super(message, 404, details);
        this.name = "NotFoundException";
    }
}