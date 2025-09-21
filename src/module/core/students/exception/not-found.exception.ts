import {
  HttpException,
  StatusCode,
} from "../../../../shared/exception/http-exception.exception";

class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.NOT_FOUND, "Not Found");
  }
}

export { NotFoundException };
