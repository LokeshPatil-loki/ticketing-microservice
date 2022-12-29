import express, { Request, Response } from "express";
import "express-async-errors";

import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { currentUserRouter } from "./routes/currentuser";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();

app.use(express.json());
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);
//"dsds"
// app.get("/api/users/currentuser", (req, res) => {
//   res.send("Hi There");
// });

app.all("/api/users/*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
app.listen(3000, () => {
  console.log("Listeninig on 3000!!!!");
});
