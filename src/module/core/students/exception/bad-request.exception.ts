import {
  HttpException,
  StatusCode,
} from "../../../../shared/exception/http-exception.exception";

class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.BAD_REQUEST, "Bad Request");
  }
}

export { BadRequestException };
