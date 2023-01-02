import express, { Request, Response } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";

import { NotFoundError } from "@loki-ticketing/common";
import { errorHandler } from "@loki-ticketing/common";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.all("/api/users/*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
