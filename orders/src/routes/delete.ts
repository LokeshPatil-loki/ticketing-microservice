import {
  curentUser,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@loki-ticketing/common";
import { Router, Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/orders";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete(
  "/api/orders/:orderId",
  curentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }
    // aaa
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.send(order);
  }
);

export { router as deleteOrderRouter };
