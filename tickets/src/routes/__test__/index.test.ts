import request from "supertest";
import { app } from "../../app";
import { createTicket } from "../../test/testUtils";

it("it can fetch a list of ticket", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send();
  expect(response.status).toEqual(200);
  expect(response.body.length).toEqual(3);
});
