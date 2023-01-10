import { OrderStatus } from "@loki-ticketing/common";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/orders";
import { Ticket } from "../../models/tickets";
import { getId } from "../../test/testUtils";

it("Returns a error if ticket does not exist", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: getId(),
    })
    .expect(404);
});

it("Returns a error if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "Area 51",
    price: 66,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: getId(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("Reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "Area 51",
    price: 66,
  });
  await ticket.save();

  let order = await Order.find({});
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  order = await Order.find({});
  expect(order.length).toEqual(1);
});
