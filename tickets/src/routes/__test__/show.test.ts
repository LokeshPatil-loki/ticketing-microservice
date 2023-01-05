import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { getId } from "../../test/testUtils";

// it("has a route listening to /api/tickets/:id ", async () => {
//   let response = await request(app).get(`/api/tickets/${getId()}`).send();
//   console.log(response.body);
//   expect(response.status).not.toEqual(404);
//   response = await request(app).get(`/api/tickets/${getId()}`).send();
//   console.log(response.body);

//   expect(response.status).not.toEqual(404);
// });

it("returns 404 if ticket is not found", async () => {
  const response = await request(app).get(`/api/tickets/${getId()}`).send();
  expect(response.status).toEqual(404);
});

it("returns ticket and status 201 if ticket is found", async () => {
  const title = "Loki";
  const price = 10.5;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: title, price: price });
  expect(response.status).toBe(201);
  const { id } = response.body;

  const ticketResponse = await request(app).get(`/api/tickets/${id}`).send().expect(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
