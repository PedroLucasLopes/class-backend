import { HttpException, StatusCode } from "./http-exception.exception.js";

class InternalErrorException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error");
  }
}

export { InternalErrorException };
