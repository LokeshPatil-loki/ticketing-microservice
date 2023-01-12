import { curentUser, requireAuth } from "@loki-ticketing/common";
import { Router, Request, Response } from "express";
import { Order } from "../models/orders";

const router = Router();

router.get("/api/orders", curentUser, requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate("ticket");

  res.send(orders);
});

export { router as indexOrderRouter };
