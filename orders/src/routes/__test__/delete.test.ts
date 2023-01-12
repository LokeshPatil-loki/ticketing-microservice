import { OrderStatus } from "@loki-ticketing/common";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { getId } from "../../test/testUtils";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 40,
  });
  await ticket.save();
  return ticket;
};

it("Returns 404 if order is not found", async () => {
  await request(app)
    .delete(`/api/orders/${getId()}`)
    .set("Cookie", global.signin())
    .send({})
    .expect(404);
});

it("Returns 401 user does not own order, which he/she trying to delete", async () => {
  const user1 = global.signin();

  const ticket = await buildTicket();

  // Create one order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send({})
    .expect(401);
});

it("Sets order status to cancel", async () => {
  const user1 = global.signin();

  const ticket = await buildTicket();

  // Create one order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user1)
    .send({});

  expect(response.status).toEqual(200);
  expect(response.body.status).toBe(OrderStatus.Cancelled);
});

it.todo("Emmit order cancelled event");
