import {
  curentUser,
  NotAuthorizedError,
  requireAuth,
  validateRequest,
} from "@loki-ticketing/common";
import { body } from "express-validator";
import { Request, Response, Router } from "express";
import { Ticket } from "../models/tickets";

const router = Router();

router.post(
  "/api/tickets",
  curentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("A valid title is expected"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({ userId: req.currentUser!.id, title, price });

    await ticket.save();
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
