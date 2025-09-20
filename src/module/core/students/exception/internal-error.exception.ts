import {
  HttpException,
  StatusCode,
} from "../../../../shared/exception/http-exception.exception";

class InternalErrorException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error");
  }
}

export { InternalErrorException };
