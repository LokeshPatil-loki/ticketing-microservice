import express, { Request, Response, NextFunction } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { errorHandler, NotFoundError } from "@loki-ticketing/common";
import { newOrderRouter } from "./routes/new";
import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes";
import { showOrderRouter } from "./routes/show";
const app = express();

app.use(express.json());
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(newOrderRouter);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);

app.all("/api/orders/*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
