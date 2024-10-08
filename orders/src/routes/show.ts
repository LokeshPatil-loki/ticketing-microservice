import {
  BadRequestError,
  curentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@loki-ticketing/common";
import { Router, Request, Response } from "express";
import { Order } from "../models/orders";

const router = Router();

router.get("/api/orders/:orderId", curentUser, requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate("ticket");
  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  res.send(order);
});

export { router as showOrderRouter };
