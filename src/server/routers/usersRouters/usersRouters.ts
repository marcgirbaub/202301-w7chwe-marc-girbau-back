import { validate } from "express-validation";
import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../../controllers/usersControllers/usersControllers.js";
import loginUserSchema from "../../schemas/loginUserSchema.js";
import registerUserSchema from "../../schemas/registerUserSchema.js";
import { upload } from "./utils.js";

const loginRoute = "/login";
const registerRoute = "/register";

const usersRouter = Router();

usersRouter.post(
  registerRoute,
  upload.single("avatar"),
  validate(registerUserSchema, {}, { abortEarly: false }),
  registerUser
);

usersRouter.post(
  loginRoute,
  validate(loginUserSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
