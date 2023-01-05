import request from "supertest";
import { app } from "../../app";

it("respond with details about the current user", async () => {
  const email = "test@test.com";

  const cookie = await global.signin();
  console.log(cookie);
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual(email);
  expect(response.body.currentUser.id).toBeDefined();
});

it("respond with null if not signed in", async () => {
  const response = await request(app).get("/api/users/currentuser").send().expect(200);

  expect(response.body.currentUser).toBeUndefined;
});
