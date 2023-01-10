import { app } from "../../app";
import request from "supertest";
import { createTicket, getId } from "../../../../orders/src/test/testUtils";
import { natsWrapper } from "../../nats-wrapper";

it("returns 404 if provided ticket id does not exist", async () => {
  const res = await request(app)
    .put(`/api/tickets/${getId()}`)
    .set("Cookie", global.signin())
    .send({ title: "232wdsd", price: 80 })
    .expect(404);
});

it("returns 401 if user is not authenticated to update the ticket", async () => {
  await request(app)
    .put(`/api/tickets/${getId()}`)
    .send({ title: "232wdsd", price: 80 })
    .expect(401);
});

it("returns 401 if user does not own the ticket he is trying to update", async () => {
  const response = await createTicket();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "sdwe22", price: 23 })
    .expect(401);
});

it("returns 400 when invalid title or price is provided", async () => {
  const response = await createTicket();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ ticker: "111" })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ price: 111 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ price: -1 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({})
    .expect(400);
});

it("Updates ticket if valid inputs are provide and return 200 with updated ticket", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "loki",
      price: 50,
    })
    .expect(200);

  const ticket = await request(app).get(`/api/tickets/${response.body.id}`).send({});

  expect(ticket.body.title).toEqual("loki");
  expect(ticket.body.price).toEqual(50);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "loki",
      price: 50,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
