import { type NextFunction, type Response, type Request } from "express";
import User from "../../../database/models/User.js";
import { type UserId } from "./types.js";

export const getUsersProfiles = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserId>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;

  try {
    const usersProfiles = await User.find({ _id: { $ne: userId } })
      .select("-password")
      .exec();

    res.status(200).json({ usersProfiles });
  } catch (error) {
    next(error);
  }
};
