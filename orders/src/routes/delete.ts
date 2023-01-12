import {
  curentUser,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@loki-ticketing/common";
import { Router, Request, Response } from "express";
import { Order } from "../models/orders";

const router = Router();

router.delete(
  "/api/orders/:orderId",
  curentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      throw new NotFoundError();
    }
    // aaa
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();
    res.send(order);
  }
);

export { router as deleteOrderRouter };
