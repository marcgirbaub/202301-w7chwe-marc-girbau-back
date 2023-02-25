import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import { type CustomJwtPayload } from "./types";
import { type UserRegisterCredentials, type UserCredentials } from "../types";

const hashingPasswordLength = 10;

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { password, username } = req.body;

  const userToFind = username.toString();

  try {
    const user = await User.findOne({ username: userToFind }).exec();

    if (!user) {
      const error = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );

      next(error);

      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Wrong credentials",
        401,
        "Wrong credentials"
      );

      next(error);

      return;
    }

    const jwtPayload: CustomJwtPayload = {
      sub: user?._id.toString(),
      username: user.username,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserRegisterCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email, passwordConfirmation, age, location } =
    req.body;

  if (passwordConfirmation !== password) {
    const error = new CustomError(
      "Passwords don't match",
      400,
      "Passwords don't match"
    );

    next(error);

    return;
  }

  try {
    const avatar = req.file!.originalname;

    const hashedPassword = await bcrypt.hash(password, hashingPasswordLength);

    await User.create({
      username,
      password: hashedPassword,
      email,
      avatar,
      age,
      location,
    });

    res.status(201).json({ message: "The user has been created" });
  } catch (error) {
    const customError = new CustomError(
      "The user couldn't be created",
      409,
      "There was a problem creating the user"
    );

    next(customError);
  }
};
