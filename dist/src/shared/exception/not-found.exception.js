import { HttpException, StatusCode } from "./http-exception.exception.js";
class NotFoundException extends HttpException {
    constructor(message) {
        super(message, StatusCode.NOT_FOUND, "Not Found");
    }
}
export { NotFoundException };
