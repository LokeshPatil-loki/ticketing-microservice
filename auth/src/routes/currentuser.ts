import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/users/currentuser", (req: Request, res: Response): void => {
  res.send("Hi There");
});

export { router as currentUserRouter };
