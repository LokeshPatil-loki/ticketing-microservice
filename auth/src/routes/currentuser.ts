import express, { Request, response, Response } from "express";
import { curentUser } from "../middlewares/current-user";

const router = express.Router();

router.get("/api/users/currentuser", curentUser, (req: Request, res: Response): void => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
