import { HttpException, StatusCode } from "./http-exception.exception.js";

class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.BAD_REQUEST, "Bad Request");
  }
}

export { BadRequestException };
