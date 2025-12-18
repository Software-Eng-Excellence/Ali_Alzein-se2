export class HttpException extends Error {
    constructor(
        public readonly message: string,
        public readonly status: number,
        public readonly details?: Record<string, unknown>
    ) {
        super(message);
        this.name = "HttpException";
    }
}