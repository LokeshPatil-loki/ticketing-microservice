import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const curentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    next();
  }
  const userJwt = req.session!.jwt;

  // If invalid token is passed in verify then it will throw an error
  try {
    const payload: UserPayload = jwt.verify(userJwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}

  next();
};
