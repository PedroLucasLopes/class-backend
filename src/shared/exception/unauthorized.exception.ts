import { HttpException, StatusCode } from "./http-exception.exception.js";

class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.UNAUTHORIZED, "Unauthorized");
  }
}

export { UnauthorizedException };
