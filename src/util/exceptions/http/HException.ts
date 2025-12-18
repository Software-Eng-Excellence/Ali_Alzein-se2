export class HttpException extends Error {
  public readonly status: number;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = this.constructor.name;
  }
}
