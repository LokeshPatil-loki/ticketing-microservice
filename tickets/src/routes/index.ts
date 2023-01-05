import { Router, Request, Response } from "express";
import { Ticket } from "../models/tickets";

const router = Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const ticketList = await Ticket.find({});
  res.status(200).send(ticketList);
});

export { router as indexTicketRouter };
