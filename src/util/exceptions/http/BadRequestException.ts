import { HttpException } from "./HException";

export class BadRequestException extends HttpException {
  constructor(
    message: string = "Bad Request",
    details?: Record<string, unknown>
  ) {
    super(message, 400, details);
    this.name = "BadRequestException";
  }
}
