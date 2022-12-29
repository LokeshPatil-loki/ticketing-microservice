import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ erros: err.serializeError() });
  }

  res.status(400).send({
    message: [{ message: "Something went wrong" }],
  });
};
