import { InternalErrorException } from "../exception/internal-error.exception";
import { BadRequestException } from "../exception/bad-request.exception";
import { UniqueConstraintException } from "../exception/unique-constraint.exception";

export const ExceptionHandler = (err: any) => {
  const errors: Record<string, () => Error> = {
    P2002: () =>
      new UniqueConstraintException(`${err.meta?.target} is already in use`),

    P2025: () => new BadRequestException(`Record not found`),

    P2000: () => new BadRequestException(`The field is too long`),

    PrismaClientValidationError: () =>
      new BadRequestException(`The field is missing or invalid`),
  };

  const factory = errors[err.code ? err.code : err.name];
  return factory
    ? factory()
    : new InternalErrorException("Internal server error");
};
