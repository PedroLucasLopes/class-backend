export class HttpException extends Error {
  public readonly status: number;
  public readonly message: string;
  public readonly statusCode: StatusCode;
  public readonly error?: string;

  constructor(message: string, status: StatusCode, error?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.statusCode = status;
    this.error = error;
  }
}

export enum StatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
}
