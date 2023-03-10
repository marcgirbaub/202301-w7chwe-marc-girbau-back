import "../loadEnvironment.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";
import usersRouter from "./routers/usersRouters/usersRouters.js";
import { usersProfilesRouter } from "./routers/usersProfilesRouters/usersProfilesRouters.js";

export const app = express();

app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/profiles", usersProfilesRouter);

app.use(notFoundError);
app.use(generalError);
