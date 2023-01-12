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

it("fetches orders for particular user", async () => {
  // Create 3 tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  // Create one order for User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);
  // Create two orders for User #2
  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket2.id,
    })
    .expect(201);
  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({
      ticketId: ticket3.id,
    })
    .expect(201);

  const res = await request(app).get(`/api/orders`).set("Cookie", user2).send();
  expect(res.status).toEqual(200);
  expect(res.body.length).toEqual(2);
});
