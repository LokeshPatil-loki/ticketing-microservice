import { OrderCreatedEvent, OrderStatus } from "@loki-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper";
import { getId } from "../../../test/testUtils";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save ticket
  const ticket = Ticket.build({
    title: "django-workshop",
    price: 100,
    userId: getId(),
  });
  await ticket.save();

  // Create fake data event
  const data: OrderCreatedEvent["data"] = {
    id: getId(),
    status: OrderStatus.Created,
    version: 0,
    userId: getId(),
    expiresAt: "232323",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // Create fake message object with ack method
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets orderid for ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("Acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const mockCalls = (natsWrapper.client.publish as jest.Mock).mock.calls;
  console.log(mockCalls[mockCalls.length - 1][1]);

  const ticketUpdatedData = JSON.parse(mockCalls[mockCalls.length - 1][1]);

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
