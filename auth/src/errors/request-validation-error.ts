import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode: number = 400;
  constructor(private erros: ValidationError[]) {
    super("Invalid request parameters");
    // Only because we are extending built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeError() {
    return this.erros.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
