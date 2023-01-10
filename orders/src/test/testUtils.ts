import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../../tickets/src/app";

const createTicket = (cookie?: string[]) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie ? cookie : global.signin())
    .send({ title: "djsjdhsd", price: 80.5 })
    .expect(201);
};

const getId = () => new mongoose.Types.ObjectId().toHexString();

export { createTicket, getId };
