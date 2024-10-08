import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { validateRequest } from "@loki-ticketing/common";
import { User } from "../models/user";
import { BadRequestError } from "@loki-ticketing/common";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must provide a password"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid email");
    }

    const isValidPassword = await Password.compare(existingUser.password, password);
    if (!isValidPassword) {
      throw new BadRequestError("Invalid password");
    }

    const userToken = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userToken,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
