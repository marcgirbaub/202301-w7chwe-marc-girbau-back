import { type NextFunction, type Response } from "express";
import User from "../../../database/models/User";
import { type CustomRequest } from "./types";

export const getUsersProfiles = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const usersProfiles = await User.find().select("-password").exec();

    res.status(200).json({ usersProfiles });
  } catch (error) {
    next(error);
  }
};
