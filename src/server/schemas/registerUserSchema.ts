import { Joi } from "express-validation";

const registerUserSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    passwordConfirmation: Joi.string().min(8).required(),
    email: Joi.string().required(),
    avatar: Joi.string(),
  }),
};

export default registerUserSchema;
