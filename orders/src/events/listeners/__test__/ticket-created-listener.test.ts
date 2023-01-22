import { TicketCreatedEvent } from "@loki-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { getId } from "../../../test/testUtils";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // Create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: getId(),
    title: "Loki Event",
    version: 0,
    price: 10,
    userId: getId(),
  };
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("Create and saves a ticket", async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // Write Assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setup();
  // call the onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // Write Assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
