import { validate } from "express-validation";
import { Router } from "express";
import { loginUser } from "../controllers/usersControllers.js";
import loginUserSchema from "../schemas/loginUserSchema.js";

const loginRoute = "/login";

const usersRouter = Router();

usersRouter.post(
  loginRoute,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
