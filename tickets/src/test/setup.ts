import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { app } from "../app";
import { getId } from "./testUtils";

declare global {
  var signin: () => string[];
}

let mongo: any;
// JEST lifecyle hook function
// To intialize test environment
// Initialize mongodb
beforeAll(async () => {
  process.env.JWT_KEY = "63b2e4ad2e028e90c80c5bb7";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Before each test
// Clear all collection
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    // Delete all documents from collection
    await collection.deleteMany({});
  }
});

// After All tests are completed
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT Payload
  const payload = {
    id: getId(),
    email: "test@test.com",
  };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Turn session into json
  const sessionJSON = JSON.stringify(session);

  // TAKE JSON and encode it to base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}; path=/; httponly`];
};
