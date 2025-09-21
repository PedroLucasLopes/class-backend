import {
  HttpException,
  StatusCode,
} from "../../../../shared/exception/http-exception.exception";

class UniqueConstraintException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.CONFLICT, "Conflict");
  }
}

export { UniqueConstraintException };
