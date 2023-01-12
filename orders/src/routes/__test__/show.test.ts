import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 40,
  });
  await ticket.save();
  return ticket;
};

it("Returns a 401 if user is not authorized to view a order", async () => {
  // Create a tickets
  const ticket = await buildTicket();

  const user = global.signin();

  // Create one order
  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const res = await request(app)
    .get(`/api/orders/${order.body.id}`)
    .set("Cookie", global.signin())
    .send();
  expect(res.status).toEqual(401);
});

it("Fetch particular order", async () => {
  // Create a tickets
  const ticket = await buildTicket();

  const user = global.signin();

  // Create one order
  const order = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const res = await request(app).get(`/api/orders/${order.body.id}`).set("Cookie", user).send();
  expect(res.status).toEqual(200);
  expect(res.body.id).toEqual(order.body.id);
});
