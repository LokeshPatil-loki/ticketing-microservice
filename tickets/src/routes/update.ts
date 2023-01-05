import {
  curentUser,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@loki-ticketing/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";

const router = Router();

router.put(
  "/api/tickets/:id",
  curentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id !== ticket.userId) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: title,
      price: price,
    });

    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
