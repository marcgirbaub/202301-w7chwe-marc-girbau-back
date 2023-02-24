import { validate } from "express-validation";
import { Router } from "express";
import { loginUser } from "../controllers/usersControllers";
import loginUserSchema from "../schemas/loginUserSchema";

const loginRoute = "/login";

const usersRouter = Router();

usersRouter.post(
  loginRoute,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
