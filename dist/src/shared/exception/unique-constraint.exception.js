import { HttpException, StatusCode } from "./http-exception.exception.js";
class UniqueConstraintException extends HttpException {
    constructor(message) {
        super(message, StatusCode.CONFLICT, "Conflict");
    }
}
export { UniqueConstraintException };
