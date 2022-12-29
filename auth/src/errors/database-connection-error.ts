import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode: number = 500;
  constructor() {
    super("Error connecting to Database");
    // Only because we are extending built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeError() {
    return [{ message: "Database Connection Error" }];
  }
}
